// Core
import { makeAutoObservable } from 'mobx';

const ACCESS_TOKEN_KEY = 'accessToken';
const ACCESS_EXPIRES_AT_UTC_KEY = 'accessExpiresAtUtc';
const REFRESH_TOKEN_KEY = 'refreshToken';
const REFRESH_EXPIRES_AT_UTC_KEY = 'refreshExpiresAtUtc';

type AuthSession = {
  accessToken: string;
  accessExpiresAtUtc: string;
  refreshToken: string;
  refreshExpiresAtUtc: string;
};

class AuthStore {
  accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);
  accessExpiresAtUtc: string | null = localStorage.getItem(ACCESS_EXPIRES_AT_UTC_KEY);

  refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);
  refreshExpiresAtUtc: string | null = localStorage.getItem(REFRESH_EXPIRES_AT_UTC_KEY);

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
    this.accessExpiresAtUtc = session.accessExpiresAtUtc;
    this.refreshToken = session.refreshToken;
    this.refreshExpiresAtUtc = session.refreshExpiresAtUtc;

    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(ACCESS_EXPIRES_AT_UTC_KEY, session.accessExpiresAtUtc);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    localStorage.setItem(REFRESH_EXPIRES_AT_UTC_KEY, session.refreshExpiresAtUtc);
  }

  setAccessToken(token: string, expiresAtUtc: string) {
    this.accessToken = token;
    this.accessExpiresAtUtc = expiresAtUtc;

    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(ACCESS_EXPIRES_AT_UTC_KEY, expiresAtUtc);
  }

  logout() {
    this.accessToken = null;
    this.accessExpiresAtUtc = null;
    this.refreshToken = null;
    this.refreshExpiresAtUtc = null;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ACCESS_EXPIRES_AT_UTC_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_EXPIRES_AT_UTC_KEY);
  }
}

export const authStore = new AuthStore();
