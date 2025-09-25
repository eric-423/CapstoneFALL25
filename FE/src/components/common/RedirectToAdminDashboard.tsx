import { Navigate } from 'react-router-dom';

const RedirectToAdminDashboard = () => {
  return <Navigate to="/admin/dashboard" replace />;
};

export default RedirectToAdminDashboard; 