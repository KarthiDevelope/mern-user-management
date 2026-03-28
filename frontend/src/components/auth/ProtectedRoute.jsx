import { Navigate, Outlet } from 'react-router';
import { Spin } from 'antd';
import { useAuth } from '../../context/AuthContext';

const LoadingScreen = () => (
  <div className='flex justify-center items-center h-screen'>
    <Spin size='large' />
  </div>
);

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to='/login'
      replace
    />
  );
};

export const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !user ? (
    <Outlet />
  ) : (
    <Navigate
      to='/dashboard'
      replace
    />
  );
};

export const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user)
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  return isAdmin ? (
    <Outlet />
  ) : (
    <Navigate
      to='/dashboard'
      replace
    />
  );
};
