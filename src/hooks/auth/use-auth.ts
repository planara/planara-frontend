// Apollo
import { useMutation } from '@apollo/client/react';
// Queries / Mutations
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  DELETE_ACCOUNT_MUTATION,
  BEGIN_REGISTRATION_MUTATION,
  type LoginMutationData,
  type LoginMutationVariables,
  type LogoutMutationData,
  type LogoutMutationVariables,
  type DeleteAccountMutationData,
  type DeleteAccountMutationVariables,
  type BeginRegistrationMutationVariables,
  type BeginRegistrationMutationData,
} from '@/graphql/auth';
// Types
import type { BeginRegistrationRequest, LoginRequest, LogoutRequest } from '@/types';

export const useAuth = () => {
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

  const [beginRegistrationMutation, beginRegistrationState] = useMutation<
    BeginRegistrationMutationData,
    BeginRegistrationMutationVariables
  >(BEGIN_REGISTRATION_MUTATION);

  const beginRegistration = async (request: BeginRegistrationRequest) => {
    const result = await beginRegistrationMutation({
      variables: {
        request,
      },
    });

    return result.data?.beginRegistration;
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
    login,
    logout,
    deleteAccount,
    beginRegistration,

    loading: loginState.loading || deleteAccountState.loading || beginRegistrationState.loading,
    error: loginState.error || deleteAccountState.error || beginRegistrationState.error,

    loginLoading: loginState.loading,
    loginError: loginState.error,

    deleteAccountLoading: deleteAccountState.loading,
    deleteAccountError: deleteAccountState.error,

    beginRegistrationLoading: beginRegistrationState.loading,
    beginRegistrationError: beginRegistrationState.error,
  };
};
