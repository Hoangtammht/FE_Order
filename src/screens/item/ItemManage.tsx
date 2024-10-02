import React, { useState } from 'react';
import { Table, Button, Select, DatePicker, Radio } from 'antd';
import 'antd/dist/reset.css';
import './itemManage.css';

const { Option } = Select;

interface MenuData {
    key: string;
    stt: number; // Cột STT
    tenThucPham: string; // Tên thực phẩm
    khoiLuongTre: string; // Khối lượng 1 trẻ (g)
    khoiLuongTinh: string; // Khối lượng tinh (g)
    khoiLuongThuc: string; // Khối lượng thực (g)
    donGia: string; // Đơn giá (đ/100g)
    thanhTien: string; // Thành tiền (đ)
}

// Dữ liệu giả theo yêu cầu
const data: MenuData[] = [
    {
        key: '1',
        stt: 1,
        tenThucPham: 'Nạc heo xay',
        khoiLuongTre: '5.00',
        khoiLuongTinh: '1,565.00',
        khoiLuongThuc: '1,565.00',
        donGia: '14,500',
        thanhTien: '226,925',
    },
    {
        key: '2',
        stt: 2,
        tenThucPham: 'Cải thảo',
        khoiLuongTre: '10.00',
        khoiLuongTinh: '3,130.00',
        khoiLuongThuc: '3,130.00',
        donGia: '3,500',
        thanhTien: '109,550',
    },
    {
        key: '3',
        stt: 3,
        tenThucPham: 'Cà rốt',
        khoiLuongTre: '10.00',
        khoiLuongTinh: '2,504.00',
        khoiLuongThuc: '2,504.00',
        donGia: '4,750',
        thanhTien: '118,940',
    },
    {
        key: '4',
        stt: 4,
        tenThucPham: 'Hành Ngò',
        khoiLuongTre: '2.00',
        khoiLuongTinh: '500.80',
        khoiLuongThuc: '626.00',
        donGia: '7,000',
        thanhTien: '43,820',
    },
    {
        key: '5',
        stt: 5,
        tenThucPham: 'Dầu mè',
        khoiLuongTre: '1.00',
        khoiLuongTinh: '313.00',
        khoiLuongThuc: '313.00',
        donGia: '9,500',
        thanhTien: '29,735',
    },
    {
        key: '6',
        stt: 6,
        tenThucPham: 'Muối Iot',
        khoiLuongTre: '1.00',
        khoiLuongTinh: '313.00',
        khoiLuongThuc: '313.00',
        donGia: '500',
        thanhTien: '1,565',
    },
    {
        key: '7',
        stt: 7,
        tenThucPham: 'Nước mắm',
        khoiLuongTre: '1.00',
        khoiLuongTinh: '313.00',
        khoiLuongThuc: '313.00',
        donGia: '3,700',
        thanhTien: '11,561',
    },
    {
        key: '8',
        stt: 8,
        tenThucPham: 'Thanh cua',
        khoiLuongTre: '5.00',
        khoiLuongTinh: '1,565.00',
        khoiLuongThuc: '1,565.00',
        donGia: '25,000',
        thanhTien: '391,250',
    },
    {
        key: '9',
        stt: 9,
        tenThucPham: 'Bánh canh',
        khoiLuongTre: '25.00',
        khoiLuongTinh: '7,825.00',
        khoiLuongThuc: '7,825.00',
        donGia: '2,500',
        thanhTien: '195,625',
    },
    {
        key: '10',
        stt: 10,
        tenThucPham: 'Đường cát',
        khoiLuongTre: '1.00',
        khoiLuongTinh: '313.00',
        khoiLuongThuc: '313.00',
        donGia: '2,200',
        thanhTien: '6,886',
    },
    {
        key: '11',
        stt: 11,
        tenThucPham: 'Dầu đậu tương',
        khoiLuongTre: '1.00',
        khoiLuongTinh: '313.00',
        khoiLuongThuc: '313.00',
        donGia: '2,700',
        thanhTien: '8,451',
    },
];

// Cấu trúc cột với tên tiêu đề từ ảnh
const columns = [
    {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        fixed: 'left' as 'left',
    },
    {
        title: 'Tên thực phẩm',
        dataIndex: 'tenThucPham',
        key: 'tenThucPham',
    },
    {
        title: 'Khối lượng 1 trẻ (g)',
        dataIndex: 'khoiLuongTre',
        key: 'khoiLuongTre',
    },
    {
        title: 'Khối lượng tinh (g)',
        dataIndex: 'khoiLuongTinh',
        key: 'khoiLuongTinh',
    },
    {
        title: 'Khối lượng thực (g)',
        dataIndex: 'khoiLuongThuc',
        key: 'khoiLuongThuc',
    },
    {
        title: 'Đơn giá (đ/100g)',
        dataIndex: 'donGia',
        key: 'donGia',
    },
    {
        title: 'Thành tiền (đ)',
        dataIndex: 'thanhTien',
        key: 'thanhTien',
    },
];

export function ItemManage() {
    const [selectedDay, setSelectedDay] = useState('Thứ 4');

    const handleDayChange = (e: any) => {
        setSelectedDay(e.target.value);
    };

    return (
        <div className="menu-container">
            <div className="header">
                <div style={{ display: 'flex', gap: 10 }}>
                    <h3>Tính khẩu phần ăn 24/05/2023</h3>
                    <DatePicker />
                </div>
            </div>

            <div className="day-selection" style={{ padding: 20 }}>
                <h4>Chọn ngày tính khẩu phần ăn</h4>
                <Radio.Group value={selectedDay} onChange={handleDayChange} style={{ marginBottom: 16 }}>
                    <Radio value="Thứ 2">Thứ 2</Radio>
                    <Radio value="Thứ 3">Thứ 3</Radio>
                    <Radio value="Thứ 4">Thứ 4</Radio>
                    <Radio value="Thứ 5">Thứ 5</Radio>
                    <Radio value="Thứ 6">Thứ 6</Radio>
                    <Radio value="Thứ 7">Thứ 7</Radio>
                    <Radio value="Chủ nhật">Chủ nhật</Radio>
                </Radio.Group>
            </div>

            <div className="control-bar" style={{ display: 'flex', gap: 10, marginLeft: 20 }}>
                <Select defaultValue="sang" style={{ width: 120 }}>
                    <Option value="sang">Sáng</Option>
                    <Option value="trua">Trưa</Option>
                    <Option value="chieu">Chiều</Option>
                </Select>
                <Select defaultValue="maugiao" style={{ width: 120 }}>
                    <Option value="maugiao">Mẫu giáo</Option>
                    <Option value="hocsinh">Học sinh</Option>
                    <Option value="sinhvien">Sinh viên</Option>
                </Select>
                <Button type="default" style={{ backgroundColor: 'green', marginLeft: 'auto' }}>Thay đổi định lượng</Button>
            </div>

            <Table<MenuData>
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                style={{ overflowX: 'auto' }}
            />
        </div>
    );
}

export default ItemManage;
