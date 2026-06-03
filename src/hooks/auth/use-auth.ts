// Apollo
import { useMutation } from '@apollo/client/react';
// Queries / Mutations
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LOGOUT_MUTATION,
  DELETE_ACCOUNT_MUTATION,
  type LoginMutationData,
  type LoginMutationVariables,
  type RegisterMutationData,
  type RegisterMutationVariables,
  type LogoutMutationData,
  type LogoutMutationVariables,
  type DeleteAccountMutationData,
  type DeleteAccountMutationVariables,
} from '@/graphql/auth';
// Types
import type { RegisterRequest, LoginRequest, LogoutRequest } from '@/types';

export const useAuth = () => {
  const [registerMutation, registerState] = useMutation<
    RegisterMutationData,
    RegisterMutationVariables
  >(REGISTER_MUTATION);

  const [loginMutation, loginState] = useMutation<LoginMutationData, LoginMutationVariables>(
    LOGIN_MUTATION,
  );

  const [logoutMutation] = useMutation<LogoutMutationData, LogoutMutationVariables>(
    LOGOUT_MUTATION,
  );

  const [deleteAccountMutation, deleteAccountState] = useMutation<
    DeleteAccountMutationData,
    DeleteAccountMutationVariables
  >(DELETE_ACCOUNT_MUTATION);

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

  const deleteAccount = async () => {
    const result = await deleteAccountMutation();

    return result.data?.deleteAccount;
  };

  return {
    register,
    login,
    logout,
    deleteAccount,

    loading: registerState.loading || loginState.loading || deleteAccountState.loading,
    error: registerState.error || loginState.error || deleteAccountState.error,

    registerLoading: registerState.loading,
    loginLoading: loginState.loading,

    registerError: registerState.error,
    loginError: loginState.error,

    deleteAccountLoading: deleteAccountState.loading,
    deleteAccountError: deleteAccountState.error,
  };
};
