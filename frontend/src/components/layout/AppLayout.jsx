import { useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  theme,
  Button,
  Tag,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const adminMenuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/users', icon: <TeamOutlined />, label: 'Users' },
    // { key: '/profile', icon: <UserOutlined />, label: 'My Profile' },
  ];
  const userMenuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/profile', icon: <UserOutlined />, label: 'My Profile' },
  ];
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const dropdownItems = {
    items: [
      // {
      //   key: 'profile',
      //   icon: <UserOutlined />,
      //   label: 'My Profile',
      //   // onClick: () => navigate('/profile'),
      //   onClick: !isAdmin ? () => navigate('/profile') : undefined,
      // },
      ...(!isAdmin
        ? [
            {
              key: 'profile',
              icon: <UserOutlined />,
              label: 'My Profile',
              onClick: () => navigate('/profile'),
            },
          ]
        : []),
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        danger: true,
        onClick: logout,
      },
    ],
  };

  const selectedKey =
    menuItems.find((item) => location.pathname.startsWith(item.key))?.key ||
    '/dashboard';

  return (
    <Layout className='min-h-screen!'>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme='dark'
        width={220}
        className='shadow-lg! h-screen!'
      >
        {/* Logo */}
        <div
          className={`h-16 flex items-center border-b border-white/10 ${collapsed ? 'justify-center' : 'px-5'}`}
        >
          {!collapsed && (
            <Text
              strong
              className='text-white! ml-2.5 text-base whitespace-nowrap'
            >
              User Management
            </Text>
          )}
        </div>

        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className='mt-2! border-r-0!'
        />
      </Sider>

      <Layout>
        <Header
          className='px-6! flex items-center justify-between shadow-sm sticky top-0 z-10'
          style={{ background: token.colorBgContainer }}
        >
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className='text-base!'
          />

          <Dropdown
            menu={dropdownItems}
            placement='bottomRight'
            arrow
          >
            <div className='flex items-center gap-2.5 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors'>
              <Avatar
                style={{ backgroundColor: token.colorPrimary }}
                icon={<UserOutlined />}
                size='small'
              />
              <div className='leading-tight'>
                <Text
                  strong
                  className='block text-[13px]'
                >
                  {user?.name}
                </Text>
                <Tag
                  color={user?.role === 'admin' ? 'gold' : 'blue'}
                  className='text-[10px] m-0! leading-4'
                >
                  {user?.role?.toUpperCase()}
                </Tag>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content className='m-6!'>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
