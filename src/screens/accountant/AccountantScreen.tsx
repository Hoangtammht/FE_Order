import { useState, useEffect } from 'react';
import { Table, DatePicker, Button, Input, Space, Typography, message, Row, Col, Dropdown, Avatar, Menu, Modal, Tag, Tabs } from 'antd';
import { SearchOutlined, FileExcelOutlined, UserOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import moment from 'moment';
import OrderHandleApi from '../../apis/OrderHandleApi';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, removeAuth } from '../../reduxs/reducers/authReducer';
import { Header } from 'antd/es/layout/layout';
import './AccountantScreen.css'
import MenuHandleApi from '../../apis/MenuHandleApi';

const { Title, Text } = Typography;
const { confirm } = Modal;
const { TabPane } = Tabs;

interface Order {
  orderID: number;
  userName: number;
  fullName: string;
  dishName: number;
  className: number;
  quantity: number;
  totalPrice: number;
}

interface MenuItem {
  menuID: number;
  userID: number;
  fullName: string;
  scheduleID: number;
  scheduleName: string;
  dishName: string;
  price: number;
  quantity: number;
  serveDate: string;
}

const AccountantScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [fromDate, setFromDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [teacherID, setTeacherID] = useState<string>('');
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<string>('1');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);



  const fetchOrders = async (from: string, to: string) => {
    setLoading(true);
    try {
      const response = await OrderHandleApi(`/order/getListOrdersByDate?from=${from}&to=${to}`, {}, 'get');
      setOrders(response.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (orderID: number, isConfirm: number, feedback?: string) => {
    try {
      const response = await OrderHandleApi(
        `/order/confirmOrder`,
        { orderID: orderID, isConfirm: isConfirm, feedback: isConfirm === 2 ? feedback : null },
        'put'
      );
      if (response.status === 200) {
        message.success('Xét duyệt thành công');
        fetchOrders(fromDate, toDate);
      } else {
        message.error('Duyệt thất bại');
      }
    } catch (error: any) {
      message.error('Duyệt thất bại');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, 'orders.xlsx');
  };

  const showConfirm = (orderID: number, isConfirm: number) => {
    const confirmTitle =
      isConfirm === 1
        ? 'Bạn có chắc chắn muốn xét duyệt đơn hàng này không?'
        : 'Bạn có chắc chắn muốn từ chối đơn hàng này không?';

    if (isConfirm === 2) {
      let feedbackValue = '';

      Modal.confirm({
        title: confirmTitle,
        content: (
          <Input.TextArea
            placeholder="Nhập lý do từ chối"
            onChange={(e) => {
              feedbackValue = e.target.value;
            }}
            rows={4}
          />
        ),
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk() {
          if (!feedbackValue) {
            message.error('Vui lòng nhập lý do từ chối');
            return Promise.reject();
          }
          handleConfirmOrder(orderID, isConfirm, feedbackValue);
        },
        onCancel() {
          setFeedback('');
        },
      });
    } else {
      confirm({
        title: confirmTitle,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk() {
          handleConfirmOrder(orderID, isConfirm);
        },
        onCancel() { },
      });
    }
  };

  const columns = [
    {
      title: 'Giáo viên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Món ăn',
      dataIndex: 'dishName',
      key: 'dishName',
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price ? `${price.toLocaleString()} VND` : 'Chưa được định giá',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text: any, record: any) => {
        const price = record.price && !isNaN(record.price) ? record.price : 0;
        const quantity = record.quantity && !isNaN(record.quantity) ? record.quantity : 0;
        const calculatedTotalPrice = price * quantity;
        return `${calculatedTotalPrice.toLocaleString()} VND`;
      }

    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <>
          {record.isConfirm === 0 ? (
            <>
              <Button
                type="primary"
                onClick={() => {
                  if (!record.price || record.price === 0) {
                    message.warning('Đơn hàng chưa có giá cụ thể, vui lòng điều chỉnh món ăn trước khi xét duyệt.');
                  } else {
                    showConfirm(record.orderID, 1);
                  }
                }}
                style={{ marginRight: '8px' }}
              >
                Xét duyệt
              </Button>
              <Button
                type="primary"
                onClick={() => showConfirm(record.orderID, 2)}
                style={{ marginTop: '8px', marginLeft: '8px' }}
              >
                Từ chối
              </Button>
            </>
          ) : record.isConfirm === 1 ? (
            <Tag color="green" style={{ marginRight: '8px' }}>
              Đã duyệt
            </Tag>
          ) : (
            <Tag color="red" style={{ marginRight: '8px' }}>
              Đã từ chối
            </Tag>
          )}
        </>
      ),
    },
  ];


  const onSearchTeacher = (value: string) => {
    setTeacherID(value);
  };

  const disabledFromDate = (current: any) => {
    return current && current > moment(toDate, 'YYYY-MM-DD').endOf('day');
  };

  const disabledToDate = (current: any) => {
    return current && current < moment(fromDate, 'YYYY-MM-DD').startOf('day');
  };

  const handleLogout = () => {
    dispatch(removeAuth({}));
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const menuColumns = [
    {
      title: 'Đầu bếp',
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
            Tìm kiếm
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90, marginTop: 8 }}>
            Đặt lại
          </Button>
        </div>
      ),
      onFilter: (value: any, record: any) => record.fullName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Tên món ăn',
      dataIndex: 'dishName',
      key: 'dishName',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'scheduleName',
      key: 'scheduleName',

    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => price ? `${price.toLocaleString()} VND` : 'Chưa được định giá',
      sorter: (a: MenuItem, b: MenuItem) => a.price - b.price,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a: MenuItem, b: MenuItem) => a.quantity - b.quantity,
    },
    {
      title: 'Ngày phục vụ',
      dataIndex: 'serveDate',
      key: 'serveDate',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a: MenuItem, b: MenuItem) => moment(a.serveDate).unix() - moment(b.serveDate).unix(),

      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <DatePicker
            format="DD/MM/YYYY"
            value={selectedKeys[0] ? moment(selectedKeys[0], 'DD/MM/YYYY') : null}
            onChange={(date, dateString) => setSelectedKeys(dateString ? [dateString] : [])}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90, marginTop: 8 }}
          >
            Đặt lại
          </Button>
        </div>
      ),
      onFilter: (value: any, record: any) => moment(record.serveDate).format('DD/MM/YYYY') === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: string, record: MenuItem) => (
        <Button type="primary" onClick={() => showModal(record)}>
          Điều chỉnh giá
        </Button>
      ),
    },
  ];

  const showModal = (menuItem: MenuItem) => {
    setCurrentMenuItem(menuItem);
    setNewPrice(menuItem.price);
    setIsModalVisible(true);
  };

  const handleEditPrice = async () => {
    if (currentMenuItem) {
      try {
        const response = await OrderHandleApi(`/menu/updatePriceOfDish`, {
          menuID: currentMenuItem.menuID,
          price: newPrice,
        }, 'put');
        message.success('Cập nhật giá thành công!');
        fetchMenus();
      } catch (error: any) {
        message.error('Có lỗi xảy ra: ' + error.message);
      } finally {
        setIsModalVisible(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchMenus = async () => {
    setLoadingMenus(true);
    try {
      const response = await MenuHandleApi(`/menu/getListMenuForAccountant`, {}, 'get');
      setMenus(response.data);
    } catch (error: any) {
      message.error('Không thể lấy dữ liệu thực đơn');
    } finally {
      setLoadingMenus(false);
    }
  };

  useEffect(() => {
    fetchOrders(fromDate, toDate);
  }, [fromDate, toDate]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === '2') {
      fetchMenus();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Title level={3} className="text-title" style={{ marginRight: '20px', lineHeight: '64px', fontSize: '24px' }}>
            Quản lý đơn hàng
          </Title>
        </div>
        <Dropdown overlay={menu} trigger={['hover']}>
          <Space style={{ cursor: 'pointer', alignItems: 'center', marginRight: '20px' }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068', width: '40px', height: '40px' }} />
            <Text className="text-content" style={{ fontSize: '16px', marginLeft: '8px' }}>
              {auth.fullName || 'Kế toán'}
            </Text>
          </Space>
        </Dropdown>
      </Header>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Quản lý đơn hàng" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col>
                <Text strong>Từ ngày: </Text>
                <DatePicker
                  defaultValue={moment()}
                  onChange={(date, dateString) => {
                    if (typeof dateString === 'string') {
                      setFromDate(dateString);
                    }
                  }}
                  disabledDate={disabledFromDate}
                  placeholder="From Date"
                />
              </Col>

              <Col>
                <Text strong>Đến ngày: </Text>
                <DatePicker
                  defaultValue={moment()}
                  onChange={(date, dateString) => {
                    if (typeof dateString === 'string') {
                      setToDate(dateString);
                    }
                  }}
                  disabledDate={disabledToDate}
                  placeholder="To Date"
                />
              </Col>
            </Row>

            <Space>
              <Input
                placeholder="Search by Teacher name"
                prefix={<SearchOutlined />}
                onChange={(e) => onSearchTeacher(e.target.value)}
              />
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel}
              >
                Export Excel
              </Button>
            </Space>

            <Table
              dataSource={orders}
              columns={columns}
              rowKey="orderID"
              loading={loading}
            />
          </Space>
        </TabPane>

        <TabPane tab="Quản lý thực đơn" key="2">

          <Space direction="vertical" style={{ width: '100%' }}>
            <Table
              dataSource={menus}
              columns={menuColumns}
              rowKey="menuID"
              loading={loadingMenus}
              bordered
              style={{ marginTop: '20px' }}
            />
          </Space>
        </TabPane>

      </Tabs>

      <Modal
        title="Cập nhật giá món ăn"
        visible={isModalVisible}
        onOk={handleEditPrice}
        onCancel={handleCancel}
      >
        <p>Tên món ăn: {currentMenuItem?.dishName}</p>
        <p>Giá hiện tại: {currentMenuItem?.price ? currentMenuItem.price.toLocaleString() : 'Chưa được định giá'} VND</p>
        <Input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(Number(e.target.value))}
          placeholder="Nhập giá mới"
        />
      </Modal>
    </div>
  );
};

export default AccountantScreen;
