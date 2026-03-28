import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Skeleton, Avatar } from 'antd';
import { TeamOutlined, UserOutlined, CheckCircleOutlined, CrownOutlined } from '@ant-design/icons';
import { usersAPI } from '../api/user';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) fetchStats();
    else setLoading(false);
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const [allRes, adminRes] = await Promise.all([
        usersAPI.getAll({ limit: 5, page: 1 }),
        usersAPI.getAll({ role: 'admin', limit: 1 }),
      ]);
      setStats({
        total: allRes?.data?.pagination?.total,
        admins: adminRes?.data?.pagination?.total,
      });
      setRecentUsers(allRes?.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // User role dashboard
  if (!isAdmin) {
    return (
      <div>
        <Title level={4} className="!mb-6">Welcome back, {user?.name} 👋</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card className="rounded-xl">
              <div className="flex items-center gap-4">
                <Avatar size={64} style={{ background: '#667eea' }} icon={<UserOutlined />} />
                <div>
                  <Title level={4} className="!mb-0">{user?.name}</Title>
                  <Text type="secondary">{user?.email}</Text>
                  <br />
                  <Tag color="blue" className="mt-1">USER</Tag>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card className="rounded-xl">
              <Title level={5}>Account Info</Title>
              <div className="flex flex-col gap-2">
                <div><Text type="secondary">Email: </Text><Text>{user?.email}</Text></div>
                <div><Text type="secondary">Phone: </Text><Text>{user?.phone || '—'}</Text></div>
                <div>
                  <Text type="secondary">Status: </Text>
                  <Tag color="green" icon={<CheckCircleOutlined />}>Active</Tag>
                </div>
                <div>
                  <Text type="secondary">Member since: </Text>
                  <Text>{user?.createdAt ? new Date(user?.createdAt)?.toLocaleDateString() : '—'}</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div>
      <Title level={4} className="!mb-6">Dashboard Overview</Title>

      {loading ? (
        <Row gutter={[16, 16]}>
          {[1, 2, 3].map((i) => (
            <Col xs={24} sm={8} key={i}>
              <Card><Skeleton active /></Card>
            </Col>
          ))}
        </Row>
      ) : (
        <>
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={8}>
              <Card className="rounded-xl border-l-4 border-l-[#667eea]">
                <Statistic
                  title="Total Users"
                  value={stats?.total}
                  prefix={<TeamOutlined className="text-[#667eea]" />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="rounded-xl border-l-4 border-l-[#faad14]">
                <Statistic
                  title="Admins"
                  value={stats?.admins}
                  prefix={<CrownOutlined className="text-[#faad14]" />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="rounded-xl border-l-4 border-l-[#52c41a]">
                <Statistic
                  title="Regular Users"
                  value={(stats?.total || 0) - (stats?.admins || 0)}
                  prefix={<UserOutlined className="text-[#52c41a]" />}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Recently Added Users" className="rounded-xl">
            <List
              dataSource={recentUsers}
              renderItem={(u) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ background: u?.role === 'admin' ? '#faad14' : '#667eea' }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={u?.name}
                    description={u?.email}
                  />
                  <Tag color={u?.role === 'admin' ? 'gold' : 'blue'}>
                    {u?.role?.toUpperCase()}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
