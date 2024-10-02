import React, { useEffect, useState } from 'react';
import { Button, Table, Typography, message } from 'antd';
import OrderHandleApi from '../../apis/OrderHandleApi';
import './ChefOrder.css';
import { MenuOutlined } from '@ant-design/icons';


const { Title } = Typography;

interface Order {
  dishName: string;
  className: string;
  quantity: number;
  totalPrice: number;
  isConfirm: number;
  createdAt: string;
}

interface ChefProps {
  onToggleMenu: () => void;
}

const ChefOrder: React.FC<ChefProps> = ({ onToggleMenu })  => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];

      try {
        const response = await OrderHandleApi(`/order/getListOrdersByDate?from=${formattedDate}&to=${formattedDate}`, {}, 'get');
        const data = response.data;

        const confirmedOrders = data.filter((order: Order) => order.isConfirm === 1);
        const aggregatedOrders: { [key: string]: Order } = {};
        confirmedOrders.forEach((order: Order) => {
          const key = order.dishName;
          if (aggregatedOrders[key]) {
            aggregatedOrders[key].quantity += order.quantity;
            aggregatedOrders[key].totalPrice += order.totalPrice;
          } else {
            aggregatedOrders[key] = { ...order };
          }
        });

        if (isMounted) {
          setOrders(Object.values(aggregatedOrders));
        }
      } catch (error) {
        
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
    {
      title: 'Món ăn',
      dataIndex: 'dishName',
      key: 'dishName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => text.split(' ')[1],
    },
  ];

  return (
    <div className="chef-order-container">
      <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onToggleMenu}
          className="menu-button"
          style={{ marginRight: '45px', fontSize: '20px', color: 'black',paddingBottom: '250px' }}
        />
      <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Danh sách Đơn Hàng của Đầu Bếp hôm nay
      </Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => record.dishName}
        loading={loading}
        pagination={false}
        bordered
        className="chef-order-table"
      />
    </div>
  );
};

export default ChefOrder;