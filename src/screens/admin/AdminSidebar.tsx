import { Menu } from 'antd';
import { HomeOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeAuth } from '../../reduxs/reducers/authReducer';
import './Slider.css';
import React from 'react';
import { Dispatch, SetStateAction } from 'react';

interface AdminProps {
  isMobile: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const AdminSidebar: React.FC<AdminProps> = ({ setCollapsed, isMobile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(removeAuth({}));
    navigate('/');
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    setCollapsed(false); 
  };

  return (
    <>
      {isMobile ? (
        <div className="sidebar">
          <div className="logo img-mobile">
            <img
              className="mb-3 img-mobile"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTchMBh57b7ExzD_5Tnf_RvKU8nQmB4RbE5Vw&s"
              alt="logo"
            />
          </div>
          <Menu mode="vertical" defaultSelectedKeys={['overview']}>
            <Menu.Item key="overview" icon={<HomeOutlined />} onClick={() => handleMenuClick('/overview')}>
              Overview
            </Menu.Item>
            <Menu.Item key="management" icon={<FileTextOutlined />} onClick={() => handleMenuClick('/management')}>
              Management
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Menu.Item>
          </Menu>
          </div>
      ) : (
        <div className="sidebar">
          <div className="logo img-mobile">
            <img
              className='mb-3 img-mobile'
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTchMBh57b7ExzD_5Tnf_RvKU8nQmB4RbE5Vw&s"
              alt="logo"
            />
          </div>
          <Menu mode="vertical" defaultSelectedKeys={['overview']}>
            <Menu.Item key="overview" icon={<HomeOutlined />} onClick={() => navigate('/overview')}>
              Tổng quan
            </Menu.Item>
            <Menu.Item key="management" icon={<FileTextOutlined />} onClick={() => navigate('/management')}>
              Quản lý
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
              Đăng xuất
            </Menu.Item>
          </Menu>
          </div>
      )}
    </>
  );
};

export default AdminSidebar;
