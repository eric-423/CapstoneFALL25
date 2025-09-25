import { Navigate } from 'react-router-dom';

const RedirectToDashboard = () => {
  return <Navigate to="/manager/dashboard" replace />;
};

export default RedirectToDashboard; 