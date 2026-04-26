// Core
import { makeAutoObservable } from 'mobx';

const ACCESS_TOKEN_KEY = 'accessToken';

class AuthStore {
  accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthenticated() {
    return Boolean(this.accessToken);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export const authStore = new AuthStore();
