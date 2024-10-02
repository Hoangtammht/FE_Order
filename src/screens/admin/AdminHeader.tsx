import { Layout, Avatar, Typography, Button } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import './Header.css';

const { Header } = Layout;
const { Text } = Typography;


interface AdminHeaderProps {
  auth: { fullName: string };
  onToggleMenu: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ auth, onToggleMenu }) => {
  return (
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
        style={{ marginRight: '20px', fontSize: '50px', lineHeight: '90px' }}
      />
      <div
        className="header-left"
        style={{
          alignItems: 'center',
          minWidth: '150px',
        }}
      >
        <Text className="header-title" strong style={{ fontSize: '18px' }}>
          Admin Dashboard
        </Text>
      </div>
      <div
        className="header-right"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flex: '1',
          minWidth: '150px',
        }}
      >
        <Avatar icon={<UserOutlined />} />
        <Text style={{ marginLeft: '10px' }}>{auth.fullName || 'Admin'}</Text>
      </div>
    </Header>
  );
};

export default AdminHeader;