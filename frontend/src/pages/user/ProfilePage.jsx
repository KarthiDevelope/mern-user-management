import { useState } from 'react';
import {
  Card, Form, Input, Button, Typography, message,
  Avatar, Tag, Divider, Row, Col, Space,
} from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { usersAPI } from '../../api/user';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const startEditing = () => {
    form.setFieldsValue({ name: user.name, phone: user.phone || '' });
    setEditing(true);
  };

  const cancelEditing = () => {
    form.resetFields();
    setEditing(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      const payload = { name: values.name, phone: values.phone };
      if (values.password) payload.password = values.password;
      await usersAPI.updateProfile(payload);
      await refreshUser();
      message.success('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const infoRows = [
    { label: 'FULL NAME',    value: user?.name },
    { label: 'EMAIL',        value: user?.email },
    { label: 'PHONE',        value: user?.phone || <span className="text-gray-300">Not provided</span> },
    {
      label: 'MEMBER SINCE',
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Title level={4} className="!mb-6">My Profile</Title>
      <Card className="rounded-xl">

        {/* Avatar header */}
        <div className="flex items-center gap-5 mb-6">
          <Avatar size={72} style={{ background: '#667eea' }} icon={<UserOutlined />} />
          <div>
            <Title level={4} className="!mb-0">{user?.name}</Title>
            <Text type="secondary">{user?.email}</Text>
            <br />
            <Tag color={user?.role === 'admin' ? 'gold' : 'blue'} className="mt-1.5">
              {user?.role?.toUpperCase()}
            </Tag>
          </div>
        </div>

        <Divider />

        {!editing ? (
          <>
            <Row gutter={[0, 16]}>
              {infoRows.map(({ label, value }) => (
                <Col span={24} key={label}>
                  <Text type="secondary" className="text-xs tracking-wider">{label}</Text>
                  <div><Text strong>{value}</Text></div>
                </Col>
              ))}
            </Row>
            <Divider />
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={startEditing}
              style={{ background: '#667eea' }}
            >
              Edit Profile
            </Button>
          </>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Required' }, { min: 2 }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="phone" label="Phone (optional)">
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="New Password (optional)"
              rules={[{ min: 6, message: 'Min 6 characters' }]}
            >
              <Input.Password placeholder="Leave blank to keep current" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['password']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const pwd = getFieldValue('password');
                    if (!pwd || !value || pwd === value) return Promise.resolve();
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                style={{ background: '#667eea' }}
              >
                Save Changes
              </Button>
              <Button icon={<CloseOutlined />} onClick={cancelEditing}>Cancel</Button>
            </Space>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
