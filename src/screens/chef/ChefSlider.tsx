import { Menu } from 'antd';
import { HomeOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeAuth } from '../../reduxs/reducers/authReducer';
import './ChefSlider.css'

import { Dispatch, SetStateAction } from 'react';

interface ChefProps {
  isMobile: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const ChefSlider: React.FC<ChefProps> = ({ setCollapsed, isMobile }) => {
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
          <Menu mode="vertical" defaultSelectedKeys={['menu']}>
            <Menu.Item key="menu" icon={<HomeOutlined />} onClick={() => handleMenuClick('/chef-manage')}>
              Thực đơn
            </Menu.Item>
            <Menu.Item key="order" icon={<FileTextOutlined />} onClick={() => handleMenuClick('/chef-order')}>
              Danh sách đặt hàng
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
              Đăng xuất
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
          <Menu mode="vertical" defaultSelectedKeys={['menu']}>
            <Menu.Item key="menu" icon={<HomeOutlined />} onClick={() => navigate('/chef-manage')}>
              Thực đơn
            </Menu.Item>
            <Menu.Item key="order" icon={<FileTextOutlined />} onClick={() => navigate('/chef-order')}>
              Danh sách đặt hàng
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


export default ChefSlider;