// Core
import { makeAutoObservable } from 'mobx';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

type AuthSession = {
  accessToken: string;
  refreshToken: string;
};

class AuthStore {
  accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);
  refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return Boolean(this.accessToken);
  }

  get getRefreshToken() {
    return this.refreshToken;
  }

  setSession(session: AuthSession) {
    this.accessToken = session.accessToken;
    this.refreshToken = session.refreshToken;

    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export const authStore = new AuthStore();
