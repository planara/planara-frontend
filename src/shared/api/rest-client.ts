// Rest
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
// Shared
import { authStore, refreshAuthSession, routeNames } from '@/shared';

const restUrl = import.meta.env.VITE_API_URL;

if (!restUrl) {
  throw new Error('VITE_API_URL is not defined');
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: ReturnType<typeof refreshAuthSession> | null = null;

const getRefreshPromise = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAuthSession().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const logoutAfterRefreshFail = () => {
  authStore.logout();

  if (window.location.pathname !== routeNames.LOGIN_PAGE) {
    window.location.href = routeNames.LOGIN_PAGE;
  }
};

export const restClient = axios.create({
  baseURL: restUrl,
});

restClient.interceptors.request.use((config) => {
  const token = authStore.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

restClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const tokens = await getRefreshPromise();

      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

      return restClient(originalRequest);
    } catch (refreshError) {
      logoutAfterRefreshFail();

      return Promise.reject(refreshError);
    }
  },
);
