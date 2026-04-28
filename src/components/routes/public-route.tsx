// Routing
import { Navigate, Outlet } from 'react-router-dom';
// Shared
import { routeNames, authStore } from '@/shared';

export const PublicRoute = () => {
  if (authStore.isAuthenticated) {
    return <Navigate to={routeNames.HOME_PAGE} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
