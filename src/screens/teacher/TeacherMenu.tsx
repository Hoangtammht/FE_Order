import { Table, DatePicker, message, Avatar, Typography, Button, Modal, Form, Select, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import './TeacherMenu.css';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { Header } from 'antd/es/layout/layout';
import { useSelector } from 'react-redux';
import { authSelector } from '../../reduxs/reducers/authReducer';
import MenuHandleApi from '../../apis/MenuHandleApi';

const { Text } = Typography;
const { Option } = Select;

interface MenuData {
    key: string;
    time: string;
    thu2: string | JSX.Element;
    thu3: string | JSX.Element;
    thu4: string | JSX.Element;
    thu5: string | JSX.Element;
    thu6: string | JSX.Element;
}
interface MenuItem {
    scheduleID: 1 | 2 | 3;
    dishName: string;
    serveDate: string;
    quantity: number;
}
interface OrderItem {
    menuID: string;
    dishName: string;
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

interface TeacherProps {
    onToggleMenu: () => void;
}

const TeacherMenu: React.FC<TeacherProps> = ({ onToggleMenu }) => {
    const [menuData, setMenuData] = useState<MenuData[]>([]);
    const [orderData, setOrderData] = useState<OrderItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(moment());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const auth = useSelector(authSelector);

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
            } catch (error) {
            }
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

    const handleOrderMeal = async (values: any) => {
        try {
            const payload = {
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                menuID: values.menuID,
                quantity: values.quantity
            };

            await MenuHandleApi('/order/createOrder', payload, 'post');
            message.success('Đặt món ăn thành công');
            setIsModalVisible(false);
            form.resetFields();
            fetchWeeklyMenuData(selectedDate!);
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Có lỗi xảy ra, vui lòng thử lại sau.');
            }
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
            <Header className="header"
                style={{
                    background: '#fff',
                    padding: '0 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                <Button
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={onToggleMenu}
                    className="menu-button"
                    style={{ marginRight: '45px', fontSize: '20px', lineHeight: '55px', color: 'black' }}
                />
                <div className="header-left">
                    <Text className="header-title" strong style={{ fontSize: '22px' }}>Thực đơn tuần này</Text>
                    <DatePicker
                        onChange={handleDateChange}
                        value={selectedDate}
                        format="DD/MM/YYYY"
                        style={{ marginLeft: '20px' }}
                        disabled
                    />
                    <Button type="primary"
                        onClick={async () => {
                            setIsModalVisible(true);
                        }
                        }
                        style={{ marginLeft: '20px' }}>
                        Đặt món
                    </Button>
                </div>
                <div className="header-right" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="user-info" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Avatar icon={<UserOutlined />} />
                        <Text style={{ marginLeft: '10px' }}>{auth.fullName || 'Đầu bếp'}</Text>
                    </div>
                </div>
            </Header>

            <Table<MenuData> columns={columns} dataSource={menuData} pagination={false} bordered style={{ overflowX: 'auto' }} />

            <Modal
                title="Đặt món"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleOrderMeal}>
                    <Form.Item
                        name="serveDate"
                        label="Ngày đặt món"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày đặt món!' }]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            // defaultValue={selectedDate}
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
                            {orderData.map((meal: OrderItem) => (
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
                            Đặt món
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>


        </div>
    );
}

export default TeacherMenu;