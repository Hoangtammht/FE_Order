import React, { useEffect, useState } from 'react';
import { Table, Typography, message, Tag, Button } from 'antd';
import OrderHandleApi from '../../apis/OrderHandleApi';
import { CheckCircleOutlined, ClockCircleOutlined, MenuOutlined } from '@ant-design/icons';

import './TeacherOrder.css';
import { Header } from 'antd/es/layout/layout';

const { Title } = Typography;

interface Order {
  dishName: string;
  className: string;
  quantity: number;
  totalPrice: number;
  isConfirm: number;
  createdAt: string;
}

interface TeacherProps {
  onToggleMenu: () => void;
}

const TeacherOrder: React.FC<TeacherProps> = ({ onToggleMenu }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchOrders();
  }, []);

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
        record.isConfirm === 0 ? (
          <Tag icon={<ClockCircleOutlined />} color="orange">
            Chờ xét duyệt
          </Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Đã duyệt
          </Tag>
        )
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
    </div>


  )
};

export default TeacherOrder;
