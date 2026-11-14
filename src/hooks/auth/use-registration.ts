// Apollo
import { useApolloClient, useMutation } from '@apollo/client/react';
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

const registrationContext = (sessionToken?: string) => ({
  registration: true,
  registrationToken: sessionToken,
});

export const useRegistration = () => {
  const client = useApolloClient();

  const [beginMutation] = useMutation<BeginRegistrationData, { request: BeginRegistrationRequest }>(
    BEGIN_REGISTRATION_MUTATION,
  );

  const [verifyMutation] = useMutation<
    VerifyRegistrationCodeData,
    { request: VerifyRegistrationCodeRequest }
  >(VERIFY_REGISTRATION_CODE_MUTATION);

  const [resendMutation] = useMutation<ResendRegistrationCodeData>(
    RESEND_REGISTRATION_CODE_MUTATION,
  );

  const [passwordMutation] = useMutation<
    SetRegistrationPasswordData,
    { request: SetRegistrationPasswordRequest }
  >(SET_REGISTRATION_PASSWORD_MUTATION);

  const [completeMutation] = useMutation<
    CompleteRegistrationData,
    { request: SetRegistrationPersonalRequest }
  >(COMPLETE_REGISTRATION_MUTATION);

  const restore = async (sessionToken: string) => {
    const response = await client.query<RegistrationFlowQueryData>({
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
