// Apollo
import { useMutation } from '@apollo/client/react';
// Queries / Mutations
import {
  REGISTRATION_FLOW_QUERY,
  BEGIN_REGISTRATION_MUTATION,
  VERIFY_REGISTRATION_CODE_MUTATION,
  RESEND_REGISTRATION_CODE_MUTATION,
  SET_REGISTRATION_PASSWORD_MUTATION,
  COMPLETE_REGISTRATION_MUTATION,
  type RegistrationFlowQueryData,
  type BeginRegistrationData,
  type VerifyRegistrationCodeData,
  type ResendRegistrationCodeData,
  type SetRegistrationPasswordData,
  type CompleteRegistrationData,
  type BeginRegistrationRequest,
  type VerifyRegistrationCodeRequest,
  type SetRegistrationPasswordRequest,
  type SetRegistrationPersonalRequest,
} from '@/graphql/auth';
// Client
import { registrationClient } from '@/shared/apollo/client';

const registrationContext = (sessionToken?: string) => ({
  headers: {
    'X-Planara-Registration-Flow': '1',
    ...(sessionToken ? { 'X-Planara-Registration-Token': sessionToken } : {}),
  },
});

export const useRegistration = () => {
  const [beginMutation] = useMutation<BeginRegistrationData, { request: BeginRegistrationRequest }>(
    BEGIN_REGISTRATION_MUTATION,
    { client: registrationClient },
  );

  const [verifyMutation] = useMutation<
    VerifyRegistrationCodeData,
    { request: VerifyRegistrationCodeRequest }
  >(VERIFY_REGISTRATION_CODE_MUTATION, { client: registrationClient });

  const [resendMutation] = useMutation<ResendRegistrationCodeData>(
    RESEND_REGISTRATION_CODE_MUTATION,
    { client: registrationClient },
  );

  const [passwordMutation] = useMutation<
    SetRegistrationPasswordData,
    { request: SetRegistrationPasswordRequest }
  >(SET_REGISTRATION_PASSWORD_MUTATION, { client: registrationClient });

  const [completeMutation] = useMutation<
    CompleteRegistrationData,
    { request: SetRegistrationPersonalRequest }
  >(COMPLETE_REGISTRATION_MUTATION, { client: registrationClient });

  const restore = async (sessionToken: string) => {
    const response = await registrationClient.query<RegistrationFlowQueryData>({
      query: REGISTRATION_FLOW_QUERY,
      context: registrationContext(sessionToken),
      fetchPolicy: 'no-cache',
    });

    return response.data?.registrationFlow;
  };

  const begin = async (request: BeginRegistrationRequest) => {
    const response = await beginMutation({
      variables: { request },
      context: registrationContext(),
    });

    return response.data?.beginRegistration;
  };

  const verify = async (request: VerifyRegistrationCodeRequest, sessionToken: string) => {
    const response = await verifyMutation({
      variables: { request },
      context: registrationContext(sessionToken),
    });

    return response.data?.verifyRegistrationCode;
  };

  const resend = async (sessionToken: string) => {
    const response = await resendMutation({
      context: registrationContext(sessionToken),
    });

    return response.data?.resendRegistrationCode;
  };

  const setPassword = async (request: SetRegistrationPasswordRequest, sessionToken: string) => {
    const response = await passwordMutation({
      variables: { request },
      context: registrationContext(sessionToken),
    });

    return response.data?.setRegistrationPassword;
  };

  const complete = async (request: SetRegistrationPersonalRequest, sessionToken: string) => {
    const response = await completeMutation({
      variables: { request },
      context: registrationContext(sessionToken),
    });

    return response.data?.completeRegistration;
  };

  return {
    restore,
    begin,
    verify,
    resend,
    setPassword,
    complete,
  };
};
