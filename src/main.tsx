// Core
import { createRoot } from 'react-dom/client';
// Styles
import './index.css';
// Font
import '@fontsource-variable/manrope/wght.css';
// Theme
import { lightTheme } from '@/shared/theme';
import { FluentProvider } from '@fluentui/react-components';
// Routing
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routeNames } from '@/shared/constants/host-names.ts';
// Pages
import EditorPage from '@/pages/editor';
import RegisterPage from '@/pages/auth/register';
import LoginPage from '@/pages/auth/login.tsx';
import HomePage from '@/pages/home';
import SettingsPage from '@/pages/settings';
// Apollo
import { apolloClient } from '@/shared/apollo/client';
import { ApolloProvider } from '@apollo/client/react';
// Loader
import { ClipLoader } from 'react-spinners';
import { useLoading } from '@/hooks/layout/use-loading.ts';
import { LoadingProvider } from '@/shared/contexts/loading/loading-provider';
// Alerts
import Alert from '@/components/layout/alert.tsx';
import type { AlertType } from '@/types/layout/alert/alert-type.ts';
import { useAlerts } from '@/hooks/layout/use-alerts.ts';
import { AlertProvider } from '@/shared/contexts/alert/alert-provider.tsx';
import ProjectsPage from '@/pages/projects';

// App layout
const App = () => {
  // Loading animation
  const { loading } = useLoading();
  // Alert
  const { alerts, removeAlert } = useAlerts();

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <div className="loader">
            <ClipLoader loading={loading} color="#ffffff" />
          </div>
        </div>
      )}

      <div className="alert-container">
        {alerts.map((alert: AlertType) => (
          <Alert
            key={alert.id}
            message={alert.message}
            position={alert.position}
            status={alert.status}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>

      <Routes>
        <Route path={routeNames.EDITOR_PAGE} element={<EditorPage />} />
        <Route path={routeNames.REGISTER_PAGE} element={<RegisterPage />} />
        <Route path={routeNames.LOGIN_PAGE} element={<LoginPage />} />
        <Route path={routeNames.HOME_PAGE} element={<HomePage />} />
        <Route path={routeNames.SETTINGS_PAGE} element={<SettingsPage />} />
        <Route path={routeNames.PROJECTS_PAGE} element={<ProjectsPage />} />
      </Routes>
    </>
  );
};

export default App;

createRoot(document.getElementById('root')!).render(
  <FluentProvider theme={lightTheme}>
    <ApolloProvider client={apolloClient}>
      <LoadingProvider>
        <AlertProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AlertProvider>
      </LoadingProvider>
    </ApolloProvider>
  </FluentProvider>,
);
