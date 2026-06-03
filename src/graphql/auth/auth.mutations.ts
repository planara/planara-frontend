// Apollo
import { gql } from '@apollo/client';
// Types
import type {
  RegisterRequest,
  RefreshRequest,
  LoginRequest,
  LogoutRequest,
  AuthResponse,
  LogoutResponse,
  DeleteAccountResponse,
} from '@/types';

export type RegisterMutationData = {
  register: AuthResponse;
};

export type RegisterMutationVariables = {
  request: RegisterRequest;
};

export type RefreshMutationData = {
  refresh: AuthResponse;
};

export type RefreshMutationVariables = {
  request: RefreshRequest;
};

export type LoginMutationData = {
  login: AuthResponse;
};

export type LoginMutationVariables = {
  login: LoginRequest;
};

export type LogoutMutationData = {
  logout: LogoutResponse;
};

export type LogoutMutationVariables = {
  request: LogoutRequest;
};

export type DeleteAccountMutationData = {
  deleteAccount: DeleteAccountResponse;
};

export type DeleteAccountMutationVariables = Record<string, never>;

/** Мутация на регистрацию */
export const REGISTER_MUTATION = gql`
  mutation Register($request: RegisterRequestInput!) {
    register(request: $request) {
      accessToken
      accessExpiresAtUtc
      refreshToken
      refreshExpiresAtUtc
    }
  }
`;

/** Мутация на обновление токенов */
export const REFRESH_MUTATION = gql`
  mutation Refresh($request: RefreshRequestInput!) {
    refresh(request: $request) {
      accessToken
      accessExpiresAtUtc
      refreshToken
      refreshExpiresAtUtc
    }
  }
`;

/** Мутация на вход */
export const LOGIN_MUTATION = gql`
  mutation Login($login: LoginRequestInput!) {
    login(login: $login) {
      accessToken
      accessExpiresAtUtc
      refreshToken
      refreshExpiresAtUtc
    }
  }
`;

/** Выход из аккаунта */
export const LOGOUT_MUTATION = gql`
  mutation Logout($request: LogoutRequestInput!) {
    logout(request: $request) {
      success
    }
  }
`;

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount {
    deleteAccount {
      success
    }
  }
`;
