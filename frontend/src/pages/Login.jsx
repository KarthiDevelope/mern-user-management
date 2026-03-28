import { Form, Input, Button, Card, Typography, Divider, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.login(values);
      const { data } = response;
      setAuth(data?.token, data?.user);
      message.success(data?.message || `Welcome back, ${data?.user?.name}!`);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Login failed';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] px-6'>
      <Card className='w-full max-w-md rounded-2xl shadow-2xl'>
        <div className='text-center mb-8'>
          <Title
            level={3}
            className='mt-3! mb-1!'
          >
            User Management
          </Title>
          <Text type='secondary'>Sign in to your account</Text>
        </div>

        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          requiredMark={false}
          size='large'
        >
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder='you@example.com'
            />
          </Form.Item>

          <Form.Item
            name='password'
            label='Password'
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Your password'
            />
          </Form.Item>

          <Form.Item className='mt-2'>
            <Button
              type='primary'
              htmlType='submit'
              block
              style={{ background: '#667eea', borderColor: '#667eea' }}
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text
            type='secondary'
            className='text-xs'
          >
            Don't have an account?
          </Text>
        </Divider>
        <div className='text-center mb-4'>
          <Link to='/signup'>Create an account</Link>
        </div>

        <Divider />
        <div className='bg-gray-50 rounded-lg p-3'>
          <Text
            type='secondary'
            className='text-xs block mb-1'
          >
            <strong>Demo Credentials</strong>
          </Text>
          <Text
            type='secondary'
            className='text-xs block'
          >
            Admin: admin@example.com / admin123
          </Text>
          <Text
            type='secondary'
            className='text-xs block'
          >
            User: alice@example.com / user1234
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
