import { Layout, Drawer } from 'antd';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authSelector } from '../../reduxs/reducers/authReducer';
import AdminSidebar from './AdminSidebar';
import AdminDashboardContent from './AdminDashboard';
import Management from './Management';
import AdminHeader from './AdminHeader';
import './AdminScreen.css';
import { useEffect, useState } from 'react';

const { Content, Sider } = Layout;

const AdminScreen = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const auth = useSelector(authSelector);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }} className="admin-layout">
       {isMobile ? (
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setCollapsed(false)}
          visible={collapsed}
          bodyStyle={{ padding: 0 }}
        >
          <AdminSidebar setCollapsed={setCollapsed} isMobile={isMobile} />  {/* Pass isMobile here */}
        </Drawer>
      ) : (
        <Sider width={250} trigger={null} collapsible collapsed={collapsed} breakpoint="lg">
          <AdminSidebar setCollapsed={setCollapsed} isMobile={isMobile} />  {/* Pass isMobile here */}
        </Sider>
      )}

      <Layout>
        <AdminHeader
          auth={auth}
          onToggleMenu={() => setCollapsed(!collapsed)}
        />
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<AdminDashboardContent />} />
            <Route path="/management" element={<Management />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default () => (
  <BrowserRouter>
    <AdminScreen />
  </BrowserRouter>
);

