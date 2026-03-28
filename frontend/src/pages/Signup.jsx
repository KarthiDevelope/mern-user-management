import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Signup = () => {
  const [form] = Form.useForm();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { data } = await authAPI.signup({ name: values.name, email: values.email, password: values.password });
      setAuth(data.token, data.user);
      message.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      message.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] px-6 py-10">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <Title level={3} className="mt-3! mb-1!">Create Account</Title>
          <Text type="secondary">Get started with UserManager</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Min 6 characters" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Repeat password" />
          </Form.Item>

          <Form.Item className="mt-2">
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ background: '#667eea', borderColor: '#667eea' }}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary" className="text-xs">Already have an account?</Text>
        </Divider>
        <div className="text-center">
          <Link to="/login">Sign in</Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
