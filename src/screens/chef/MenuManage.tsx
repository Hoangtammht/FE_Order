import { Table, DatePicker, message, Avatar, Typography, Button, Modal, Form, Input, Select, InputNumber, Dropdown, Menu } from 'antd';
import 'antd/dist/reset.css';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { Header } from 'antd/es/layout/layout';
import { useSelector } from 'react-redux';
import { authSelector, removeAuth } from '../../reduxs/reducers/authReducer';
import MenuHandleApi from '../../apis/MenuHandleApi';
import { useDispatch } from 'react-redux';
import './MenuManage.css';

const { Text } = Typography;
const { Option } = Select;

interface MenuData {
  key: string;
  time: string;
  thu2: JSX.Element;
  thu3: JSX.Element;
  thu4: JSX.Element;
  thu5: JSX.Element;
  thu6: JSX.Element;
}

interface MenuItem {
  scheduleID: 1 | 2 | 3;
  dishName: string;
  serveDate: string;
  quantity: number;
}

const createStyledMeals = (meals: { dishName: string; quantity: number }[]): JSX.Element => {
  return (
    <>
      {meals.map((meal, index) => (
        <div key={index} style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {meal.dishName} (Số lượng: {meal.quantity})
        </div>
      ))}
    </>
  );
};

interface ChefProps {
  onToggleMenu: () => void;
}

const MenuManage: React.FC<ChefProps> = ({ onToggleMenu })  => {
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(moment());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  const fetchWeeklyMenuData = async (date: moment.Moment) => {
    const newMenuData: MenuData[] = [];
    const scheduleNames = ['Sáng', 'Trưa', 'Chiều'];
    const startOfWeek = date.clone().startOf('isoWeek');
    const scheduleGrouped: { [key: number]: { [key: number]: { dishName: string; quantity: number }[] } } = {
      1: {},
      2: {},
      3: {},
    };

    for (let j = 1; j <= 3; j++) {
      for (let i = 0; i < 5; i++) {
        scheduleGrouped[j][i] = [];
      }
    }

    for (let i = 0; i < 5; i++) {
      const currentDate = startOfWeek.clone().add(i, 'days');
      const formattedDate = currentDate.format('YYYY-MM-DD');

      try {
        const response = await MenuHandleApi(`/menu/getMenuByDate?serveDate=${formattedDate}`, {}, 'get');
        const data: MenuItem[] = response.data;

        data.forEach((menuItem: MenuItem) => {
          const { scheduleID, dishName, serveDate, quantity } = menuItem;
          const serveDateMoment = moment(serveDate);
          const dayIndex = serveDateMoment.isoWeekday() - 1;

          if (dayIndex >= 0 && dayIndex < 5) {
            scheduleGrouped[scheduleID][dayIndex].push({ dishName, quantity });
          }
        });
      } catch (error) { }
    }

    for (let j = 1; j <= 3; j++) {
      newMenuData.push({
        key: j.toString(),
        time: scheduleNames[j - 1],
        thu2: createStyledMeals(scheduleGrouped[j][0] || []),
        thu3: createStyledMeals(scheduleGrouped[j][1] || []),
        thu4: createStyledMeals(scheduleGrouped[j][2] || []),
        thu5: createStyledMeals(scheduleGrouped[j][3] || []),
        thu6: createStyledMeals(scheduleGrouped[j][4] || []),
      });
    }

    setMenuData(newMenuData);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      const startOfWeek = date.clone().startOf('isoWeek');
      setSelectedDate(startOfWeek);
      fetchWeeklyMenuData(startOfWeek);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchWeeklyMenuData(selectedDate);
    }
  }, [selectedDate]);

  const handleAddMenu = async (values: any) => {
    try {
      await MenuHandleApi(
        '/menu/addDishToMenu',
        {
          scheduleID: values.scheduleID,
          dishName: values.dishName,
          price: values.price,
          quantity: values.quantity,
          serveDate: values.serveDate.format('YYYY-MM-DD'),
        },
        'post'
      );

      message.success('Thêm món ăn thành công');
      setIsModalVisible(false);
      form.resetFields();
      fetchWeeklyMenuData(selectedDate!);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      fixed: 'left' as 'left',
    },
    {
      title: 'Thứ 2',
      dataIndex: 'thu2',
      key: 'thu2',
    },
    {
      title: 'Thứ 3',
      dataIndex: 'thu3',
      key: 'thu3',
    },
    {
      title: 'Thứ 4',
      dataIndex: 'thu4',
      key: 'thu4',
    },
    {
      title: 'Thứ 5',
      dataIndex: 'thu5',
      key: 'thu5',
    },
    {
      title: 'Thứ 6',
      dataIndex: 'thu6',
      key: 'thu6',
    },
  ];

  return (
    <div className="menu-container">
      <Header
        className="header"
        style={{
          background: '#fff',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onToggleMenu}
          className="menu-button"
          style={{ marginRight: '45px', fontSize: '20px', lineHeight: '45px', color: 'black' }}
        />
        <div className="header-left" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Text className="header-title" strong style={{ fontSize: '25px', flex: '1 1 auto' }}>
            Danh sách thực đơn
          </Text>
          <DatePicker
            onChange={handleDateChange}
            value={selectedDate}
            format="DD/MM/YYYY"
            style={{ marginLeft: '20px', marginTop: '10px', flex: '1 1 auto' }}
          />
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            style={{ marginLeft: '20px', marginTop: '10px', flex: '1 1 auto' }}
          >
            Thêm món ăn
          </Button>
        </div>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="user-info" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: '1 1 auto' }}>
              <Avatar icon={<UserOutlined />} />
              <Text style={{ marginLeft: '10px' }}>{auth.fullName || 'Đầu bếp'}</Text>
            </div>
        </div>
      </Header>

      <Table
        columns={columns}
        dataSource={menuData}
        pagination={false}
        bordered
        scroll={{ x: true }}
        style={{ overflowX: 'auto' }}
      />
      <Modal
        title="Thêm món ăn"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddMenu}>
          <Form.Item
            name="dishName"
            label="Tên món ăn"
            rules={[{ required: true, message: 'Vui lòng nhập tên món ăn!' }]}
          >
            <Input placeholder="Nhập tên món ăn" />
          </Form.Item>
          <Form.Item
            name="scheduleID"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
          >
            <Select placeholder="Chọn thời gian">
              <Option value={1}>Buổi sáng</Option>
              <Option value={2}>Buổi trưa</Option>
              <Option value={3}>Buổi chiều</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng món"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng món ăn!' }]}
          >
            <InputNumber min={1} placeholder="Nhập số lượng món ăn" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="serveDate"
            label="Ngày phục vụ"
            rules={[{ required: true, message: 'Vui lòng chọn ngày phục vụ!' }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                return current && current < moment().startOf('day');
              }}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá món ăn!' }]}
          >
            <InputNumber min={0} placeholder="Nhập giá món ăn" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MenuManage;
