import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Tag, Button, Modal, Form, DatePicker, Select, InputNumber } from 'antd';
import OrderHandleApi from '../../apis/OrderHandleApi';
import { CheckCircleOutlined, ClockCircleOutlined, MenuOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './TeacherOrder.css';
import moment from 'moment';
import MenuHandleApi from '../../apis/MenuHandleApi';


const { Option } = Select;
const { Title } = Typography;

interface Order {
  orderID: number;
  dishName: string;
  className: string;
  quantity: number;
  scheduleID: 1 | 2 | 3;
  totalPrice: number;
  scheduleName: string;
  isConfirm: number;
  createdAt: string;
}

interface TeacherProps {
  onToggleMenu: () => void;
}

interface OrderItem {
  scheduleID: 1 | 2 | 3;
  scheduleName: string;
  menuID: string;
  dishName: string;
}

const TeacherOrder: React.FC<TeacherProps> = ({ onToggleMenu }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderData, setOrderData] = useState<OrderItem[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<OrderItem[]>([]);
  const [form] = Form.useForm();

  const handleEditOrder = async (order: Order) => {
    setCurrentOrder(order);
    setIsModalVisible(true);
    // form.setFieldsValue({
    //   serveDate: moment(order.createdAt),
    //   scheduleID: order.scheduleID,
    //   dishName: order.dishName,
    //   quantity: order.quantity,
    // });
  
  };
  

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await OrderHandleApi(`/order/getOrderByTeacherName`, {}, 'get');
      setOrders(response.data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrder = async (values: any) => {
    const payload = {
      menuID: values.menuID,
      orderID: currentOrder?.orderID || 0,
      quantity: values.quantity, 
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  
    try {
      const response = await OrderHandleApi(`/order/editOrder`, payload, 'put');
      message.success('Đơn hàng đã được cập nhật thành công!');
      setIsModalVisible(false);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
    } else {
        message.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
    }
  };
  

  useEffect(() => {
    fetchOrders();
  }, [isModalVisible]);

  const columns = [
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
      title: 'Thời gian',
      dataIndex: 'scheduleName',
      key: 'scheduleName',
    },
    {
      title: 'Tổng giá (VND)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text: number) => `${text.toLocaleString()} VNĐ`,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => text,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <>
          {record.isConfirm === 0 ? (
            <>
              <Tag icon={<ClockCircleOutlined />} color="orange">
                Chờ xét duyệt
              </Tag>
              <Button type="link" onClick={() => handleEditOrder(record)}>
                Điều chỉnh lại đơn hàng
              </Button>
            </>
          ) : record.isConfirm === 1 ? (
            <Tag icon={<CheckCircleOutlined />} color="green">
              Đã duyệt
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="red">
              Từ chối
            </Tag>
          )}
        </>
      ),
    }    
  ];

  return (
    <div className="teacher-order-container">
      <div className="header-container">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onToggleMenu}
          className="menu-button"
          style={{ marginRight: '45px', fontSize: '20px', color: 'black', paddingBottom: '220px' }}
        />
        <Title level={3} className="header-title">
          Các đơn Hàng của Giáo Viên
        </Title>
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => `${record.dishName}-${record.className}`}
        loading={loading}
        pagination={false}
        bordered
        scroll={{ x: true }}
        style={{ overflowX: 'auto' }}
        className="teacher-order-table"
      />

      <Modal
        title="Chỉnh sửa đơn hàng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(values) => handleSaveOrder(values)}
        >
          <Form.Item
            name="serveDate"
            label="Ngày đặt món"
            rules={[{ required: true, message: 'Vui lòng chọn ngày đặt món!' }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < moment().startOf('day')}
              onChange={async (date) => {
                if (date) {
                  const formattedDate = date.format('YYYY-MM-DD');
                  try {
                    const response = await MenuHandleApi(`/menu/getMenuByDate?serveDate=${formattedDate}`, {}, 'get');
                    setOrderData(response.data);
                  } catch (error) {
                    console.error(error);
                  }
                }
              }}
            />
          </Form.Item>

          <Form.Item
            name="scheduleID"
            label="Buổi"
            rules={[{ required: true, message: 'Vui lòng chọn buổi!' }]}
          >
            <Select
              placeholder="Chọn buổi"
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
              onChange={(selectedSchedule) => {
                const filteredMeals = orderData.filter(
                  (meal: OrderItem) => meal.scheduleID === selectedSchedule
                );
                setFilteredMeals(filteredMeals);
              }}
            >
              <Option value={1}>Sáng</Option>
              <Option value={2}>Trưa</Option>
              <Option value={3}>Chiều</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="menuID"
            label="Món ăn"
            rules={[{ required: true, message: 'Vui lòng chọn món ăn!' }]}
          >
            <Select
              placeholder="Chọn món ăn"
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
            >
              {filteredMeals.map((meal: OrderItem) => (
                <Option key={meal.menuID} value={meal.menuID}>
                  {meal.dishName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={1} placeholder="Nhập số lượng" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>

      </Modal>
    </div>
  );
};

export default TeacherOrder;
