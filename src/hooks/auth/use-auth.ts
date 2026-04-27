// Apollo
import { useMutation } from '@apollo/client/react';
// Mutations
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LOGOUT_MUTATION,
  type LoginMutationData,
  type LoginMutationVariables,
  type RegisterMutationData,
  type RegisterMutationVariables,
  type LogoutMutationData,
  type LogoutMutationVariables,
} from '@/graphql/auth';
// Requests
import type { RegisterRequest } from '@/types/api/requests/auth/register-request';
import type { LoginRequest } from '@/types/api/requests/auth/login-request';
import type { LogoutRequest } from '@/types/api/requests/auth/logout-request.ts';

export const useAuth = () => {
  const [registerMutation, registerState] = useMutation<
    RegisterMutationData,
    RegisterMutationVariables
  >(REGISTER_MUTATION);

  const [loginMutation, loginState] = useMutation<LoginMutationData, LoginMutationVariables>(
    LOGIN_MUTATION,
  );

  // внутри useAuth
  const [logoutMutation] = useMutation<LogoutMutationData, LogoutMutationVariables>(
    LOGOUT_MUTATION,
  );

  const register = async (request: RegisterRequest) => {
    const response = await registerMutation({
      variables: {
        request,
      },
    });

    return response.data?.register;
  };

  const login = async (login: LoginRequest) => {
    const response = await loginMutation({
      variables: {
        login,
      },
    });

    return response.data?.login;
  };

  const logout = async (request: LogoutRequest) => {
    const result = await logoutMutation({
      variables: {
        request,
      },
    });

    return result.data?.logout;
  };

  return {
    register,
    login,
    logout,

    loading: registerState.loading || loginState.loading,
    error: registerState.error || loginState.error,

    registerLoading: registerState.loading,
    loginLoading: loginState.loading,

    registerError: registerState.error,
    loginError: loginState.error,
  };
};
