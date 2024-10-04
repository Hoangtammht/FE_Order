import { useState, useEffect } from 'react';
import { Table, Tag, Typography, Button, Input, message, Modal, Form, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import './Management.css';
import ListUserHandleApi from '../../apis/ListUserHandleApi';
import './AdminScreen.css';


const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface Role {
  roleID: number;
  roleName: string;
}

const Management = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(2);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalAssignClass, setModalAssignClass] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [form] = Form.useForm();

  const [roles, setRoles] = useState<Role[]>([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchRoles = async () => {
    try {
      const response = await ListUserHandleApi(`/role/getAllRoles`, {}, 'get');
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchUsers = async (roleID: number) => {
    setIsLoading(true);
    try {
      const response = await ListUserHandleApi(`/user/getListUserByRole?roleID=${roleID}`, {}, 'get');
      if (response.data) {
        setUsers(response.data);
        if (roleID === 2) {
          setTeachers(response.data);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await ListUserHandleApi(`/class/getAllClass`, {}, 'get');
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  useEffect(() => {
    fetchUsers(selectedRole);
    fetchRoles();
    fetchClasses();
  }, [selectedRole]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showModalAssignClass = () => {
    setModalAssignClass(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await ListUserHandleApi(`/user/registerUser`, {
        fullName: values.fullName,
        password: values.password,
        roleID: values.roleID,
        userName: values.userName,
      }, 'post');

      if (response.status === 200) {
        message.success('Tạo tài khoản thành công');
        setIsModalVisible(false);
        form.resetFields();
        fetchUsers(selectedRole);
      }
    } catch (error) {
      message.error('Tạo tài khoản thất bại');
    }
  };

  const handleSubmitAssignClass = async () => {
    try {
      const values = await form.validateFields();
      const response = await ListUserHandleApi(`/class/assignClass`, {
        userName: values.userName,
        classID: values.classID
      }, 'put');

      if (response.status === 200) {
        message.success('Phân lớp thành công');
        setModalAssignClass(false);
        form.resetFields();
        fetchUsers(selectedRole);
      }
    } catch (error: any) {
      message.error('Phân lớp thất bại');
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    form.setFieldsValue({
      fullName: user.fullName,
      userName: user.userName,
      password: '',
      roleID: user.roleID,
    });
    setIsModalEditVisible(true);
  };

  const handleSubmitEdit = async () => {
    try {
      const values = await form.validateFields();
      const response = await ListUserHandleApi(`/user/editAccount`, {
        fullName: values.fullName,
        password: values.password,
        roleID: values.roleID,
        userName: values.userName,
      }, 'put');

      if (response.status === 200) {
        message.success('Chỉnh sửa tài khoản thành công');
        setIsModalEditVisible(false);
        form.resetFields();
        fetchUsers(selectedRole);
      }
    } catch (error) {
      message.error('Chỉnh sửa tài khoản thất bại');
    }
  };

  const confirmDelete = (userName: string, onDelete: () => void) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tài khoản này không?',
      content: `Tài khoản: ${userName}`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: onDelete,
      onCancel() {
        console.log('Hủy thao tác xóa tài khoản');
      },
    });
  };

  const handleDelete = async (userName: string) => {
    try {
      const response = await ListUserHandleApi(`/user/deleteAccount?userName=${userName}`, {}, 'put');
      if (response.status === 200) {
        message.success('Xóa tài khoản thành công');
        fetchUsers(selectedRole);
      }
    } catch (error) {
      message.error('Xóa tài khoản thất bại');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancelAssignClass = () => {
    setModalAssignClass(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: any, b: any) => a.fullName.localeCompare(b.fullName),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Full Name"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90, marginTop: 8 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value: any, record: any) => record.fullName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Tài khoản',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a: any, b: any) => a.userName.localeCompare(b.userName),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Username"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90, marginTop: 8 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value: any, record: any) => record.userName.toLowerCase().includes(value.toLowerCase()),
    },
    ...(selectedRole === 2 ? [{
      title: 'Lớp học',
      dataIndex: 'className',
      key: 'className',
      render: (classID: any, record: any) => {
        return record.className ? (
          <span style={{ fontWeight: 'bold' }}>{record.className}</span>
        ) : (
          <span style={{ color: 'red', fontStyle: 'italic' }}>Chưa phân lớp</span>
        );
      },
    }] : []
    ),
    {
      title: 'Vai trò',
      dataIndex: 'roleID',
      key: 'roleID',
      render: (roleID: number) => {
        const roleMap: { [key: number]: string } = {
          1: 'Admin',
          2: 'Teacher',
          3: 'Chef',
          4: 'Accountant',
        };
        return <Tag color="blue">{roleMap[roleID] || 'Unknown'}</Tag>;
      },
      sorter: (a: any, b: any) => a.roleID - b.roleID,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (text: any, record: any) => (
        <div>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => confirmDelete(record.userName, () => handleDelete(record.userName))}
          >
            Xóa
          </Button>
        </div>
      ),
    },

  ];

  return (
    <div className="management-content">
      <Title level={2}>Quản lý và phân quyền</Title>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <Button type={selectedRole === 2 ? 'primary' : 'default'} onClick={() => setSelectedRole(2)}>
            Giáo Viên
          </Button>
          <Button type={selectedRole === 3 ? 'primary' : 'default'} onClick={() => setSelectedRole(3)} style={{ marginLeft: '10px' }}>
            Đầu bếp
          </Button>
          <Button type={selectedRole === 4 ? 'primary' : 'default'} onClick={() => setSelectedRole(4)} style={{ marginLeft: '10px' }}>
            Kế toán
          </Button>
        </div>

        <div>
          <Button style={{ marginTop: '10px' }} type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Thêm tài khoản
          </Button>

          <Button style={{ marginTop: '10px', marginLeft: '10px' }} type="primary" icon={<PlusOutlined />} onClick={showModalAssignClass}>
            Phân lớp
          </Button>
        </div>
      </div>

      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={users}
          loading={isLoading}
          pagination={{ pageSize: 7 }}
          rowKey="userID"
          bordered
          scroll={{ x: 'max-content' }}
        />
      </div>

      <Modal
        title="Thêm tài khoản"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="Tạo tài khoản"
        cancelText="Hủy"
      >
        <Form layout='vertical' form={form} size='large'>
          <Form.Item
            name={'fullName'}
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder='Enter full name' allowClear maxLength={100} />
          </Form.Item>
          <Form.Item
            name={'userName'}
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input placeholder='Enter username' allowClear maxLength={100} />
          </Form.Item>
          <Form.Item
            name={'password'}
            label="Password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder='Enter password' allowClear />
          </Form.Item>
          <Form.Item
            name={'roleID'}
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder='Select role' allowClear>
              {roles.map(role => (
                <Option key={role.roleID} value={role.roleID}>
                  {role.roleName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Phân lớp"
        visible={isModalAssignClass}
        onOk={handleSubmitAssignClass}
        onCancel={handleCancelAssignClass}
        okText="Phân lớp"
        cancelText="Hủy"
      >
        <Form layout='vertical' form={form} size='large'>
          <Form.Item
            name={'userName'}
            label="Giáo viên"
            rules={[{ required: true, message: 'Please select a teacher' }]}
          >
            <Select placeholder='Chọn giáo viên' allowClear>
              {teachers.map((teacher: any) => (
                <Option key={teacher.userName} value={teacher.userName}>
                  {teacher.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={'classID'}
            label="Lớp học"
            rules={[{ required: true, message: 'Please select a class' }]}
          >
            <Select placeholder='Chọn lớp học' allowClear>
              {classes.map((classItem: any) => (
                <Option key={classItem.classID} value={classItem.classID}>
                  {classItem.className}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa tài khoản"
        visible={isModalEditVisible}
        onOk={handleSubmitEdit}
        onCancel={() => setIsModalEditVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tài khoản"
            name="userName"
            rules={[{ required: true, message: 'Vui lòng nhập tài khoản' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item 
          label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password placeholder="Vui lòng nhập mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="roleID"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              {roles.map(role => (
                <Option key={role.roleID} value={role.roleID}>
                  {role.roleName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default Management;