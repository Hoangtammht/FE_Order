import { Drawer, Layout } from 'antd';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import ChefSlider from './ChefSlider';
import MenuManage from './MenuManage';
import ChefOrder from './ChefOrder';
import './ChefScreen.css'
import { useEffect, useState } from 'react';

const { Content, Sider } = Layout;

const ChefScreen = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
          <ChefSlider isMobile={isMobile} setCollapsed={setCollapsed}/>
        </Drawer>
      ) :
        (
          <Sider
            width={250}
            breakpoint="lg"
            collapsedWidth="0"
            trigger={null}
          >
            <ChefSlider isMobile={isMobile} setCollapsed={setCollapsed}/>
          </Sider>
        )}
      <Layout>
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/chef-manage" replace />} />
            <Route path="/chef-manage" element={<MenuManage onToggleMenu={() => setCollapsed(!collapsed)}/>} />
            <Route path="/chef-order" element={<ChefOrder onToggleMenu={() => setCollapsed(!collapsed)}/>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};


export default () => (
  <BrowserRouter>
    <ChefScreen />
  </BrowserRouter>
);
