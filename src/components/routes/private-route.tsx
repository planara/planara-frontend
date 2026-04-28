// Routing
import { Navigate, Outlet } from 'react-router-dom';
// Shared
import { routeNames, authStore } from '@/shared';

export const PrivateRoute = () => {
  if (!authStore.isAuthenticated) {
    return <Navigate to={routeNames.LOGIN_PAGE} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
