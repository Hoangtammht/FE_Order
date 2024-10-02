import { Drawer, Layout } from 'antd';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import TeacherSlide from './TeacherSlide';
import TeacherMenu from './TeacherMenu';
import TeacherOrder from './TeacherOrder';
import { useEffect, useState } from 'react';


const { Content, Sider } = Layout;

const TeacherScreen = () => {

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
          <TeacherSlide isMobile={isMobile} setCollapsed={setCollapsed}/>
        </Drawer>
      ) :
        (
          <Sider
            width={250}
            breakpoint="lg"
            collapsedWidth="0"
            trigger={null}
          >
            <TeacherSlide isMobile={isMobile} setCollapsed={setCollapsed}/>
          </Sider>
        )}
      <Layout>
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/teacher-menu" replace />} />
            <Route path="/teacher-menu" element={<TeacherMenu onToggleMenu={() => setCollapsed(!collapsed)}/>} />
            <Route path="/teacher-order" element={<TeacherOrder onToggleMenu={() => setCollapsed(!collapsed)}/>}/>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default () => (
  <BrowserRouter>
    <TeacherScreen />
  </BrowserRouter>
);
