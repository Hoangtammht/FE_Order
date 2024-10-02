import { Card, Col, Row } from 'antd';

const AdminDashboardContent = () => {
  return (
    <div className="dashboard-content">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <h2>Welcome to your dashboard!</h2>
            <p>This is Order Application admin dashboard designed to reflect...</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardContent;
