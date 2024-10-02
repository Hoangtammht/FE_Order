import { useState, useEffect } from 'react';
import { Table, Tag, Typography, Button, Input, message, Modal, Form, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import './Management.css';
import ListUserHandleApi from '../../apis/ListUserHandleApi';
import './AdminScreen.css';


const { Title } = Typography;
const { Option } = Select;

interface Role {
  roleID: number;
  roleName: string;
}

const Management = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(2);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [roles, setRoles] = useState<Role[]>([]); 

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
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(selectedRole);
    fetchRoles();
  }, [selectedRole]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form Values: ', values);
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
      console.error('Error creating user:', error);
      message.error('Tạo tài khoản thất bại');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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

        <Button style={{marginTop: '10px'}} type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Thêm tài khoản
        </Button>
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
    </div>
  );
};

export default Management;