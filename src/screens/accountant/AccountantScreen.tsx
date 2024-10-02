import { useState, useEffect } from 'react';
import { Table, DatePicker, Button, Input, Space, Typography, message, Row, Col, Dropdown, Avatar, Menu, Modal } from 'antd';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import moment from 'moment';
import OrderHandleApi from '../../apis/OrderHandleApi';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, removeAuth } from '../../reduxs/reducers/authReducer';
import { Header } from 'antd/es/layout/layout';
import './AccountantScreen.css'

const { Title, Text } = Typography;
const { confirm } = Modal;

interface Order {
  orderID: number;
  userName: number;
  dishName: number;
  className: number;
  quantity: number;
  totalPrice: number;
}

const AccountantScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [teacherID, setTeacherID] = useState<string>('');
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

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

  const handleConfirmOrder = async (orderID: number) => {
    try {
      const response = await OrderHandleApi(`/order/confirmOrder`,
        { orderID: orderID, isConfirm: 1 },
        'put');
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

  const showConfirm = (orderID: number) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xét duyệt đơn hàng này không?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk() {
        handleConfirmOrder(orderID);
      },
      onCancel() {
        console.log('Cancelled');
      },
    });
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID',
    },
    {
      title: 'Giáo viên',
      dataIndex: 'userName',
      key: 'userName',
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
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        record.isConfirm === 0 ? (
          <Button
            type="primary"
            onClick={() => showConfirm(record.orderID)}
          >
            Chờ xét duyệt
          </Button>
        ) : (
          <Button
            type="primary"
            disabled
          >
            Đã duyệt
          </Button>
        )
      ),
    }
  ];

  const onSearchTeacher = (value: string) => {
    setTeacherID(value);
  };

  useEffect(() => {
    fetchOrders(fromDate, toDate);
  }, [fromDate, toDate]);

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

  return (
    <div style={{ padding: '20px' }}>
      <Header className="header">
        <div className="header-left">
          <Title level={3} className="text-title">Quản lý đơn hàng</Title>
        </div>
        <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
          <div className="header-right">
            <Avatar icon={<UserOutlined />} />
            <Text className="text-content">{auth.fullName || 'Kế toán'}</Text>
          </div>
        </Dropdown>
      </Header>

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
            Export to Excel
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={orders.filter((order) => order.userName.toString().includes(teacherID))}
        rowKey="orderID"
        loading={loading}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default AccountantScreen;
