// Apollo
import { gql } from '@apollo/client';
// Types
import type { AuthResponse } from '@/types';

export type RegistrationStep = 'EMAIL' | 'CODE' | 'PASSWORD' | 'PERSONAL' | 'COMPLETED';

export type RegistrationFlow = {
  sessionToken: string;
  step: RegistrationStep;
  nextStep: RegistrationStep;
};

export type BeginRegistrationRequest = {
  email: string;
  personalDataConsent: boolean;
  consentVersionId: string;
};

export type VerifyRegistrationCodeRequest = {
  code: string;
};

export type SetRegistrationPasswordRequest = {
  password: string;
  confirmPassword: string;
};

export type SetRegistrationPersonalRequest = {
  name?: string;
  surname?: string;
};

export type RegistrationFlowQueryData = {
  registrationFlow: RegistrationFlow | null;
};

export type BeginRegistrationData = {
  beginRegistration: RegistrationFlow;
};

export type VerifyRegistrationCodeData = {
  verifyRegistrationCode: RegistrationFlow;
};

export type ResendRegistrationCodeData = {
  resendRegistrationCode: boolean;
};

export type SetRegistrationPasswordData = {
  setRegistrationPassword: RegistrationFlow;
};

export type CompleteRegistrationData = {
  completeRegistration: AuthResponse;
};

/** Восстановление шага регистрации по токену из URL */
export const REGISTRATION_FLOW_QUERY = gql`
  query RegistrationFlow {
    registrationFlow {
      sessionToken
      step
      nextStep
    }
  }
`;

/** Начало регистрации */
export const BEGIN_REGISTRATION_MUTATION = gql`
  mutation BeginRegistration($request: BeginRegistrationRequestInput!) {
    beginRegistration(request: $request) {
      sessionToken
      step
      nextStep
    }
  }
`;

/** Подтверждение почты */
export const VERIFY_REGISTRATION_CODE_MUTATION = gql`
  mutation VerifyRegistrationCode($request: VerifyRegistrationCodeRequestInput!) {
    verifyRegistrationCode(request: $request) {
      sessionToken
      step
      nextStep
    }
  }
`;

/** Повторная отправка кода */
export const RESEND_REGISTRATION_CODE_MUTATION = gql`
  mutation ResendRegistrationCode {
    resendRegistrationCode
  }
`;

/** Установка пароля */
export const SET_REGISTRATION_PASSWORD_MUTATION = gql`
  mutation SetRegistrationPassword($request: SetRegistrationPasswordRequestInput!) {
    setRegistrationPassword(request: $request) {
      sessionToken
      step
      nextStep
    }
  }
`;

/** Создание аккаунта и выдача обычных access/refresh токенов */
export const COMPLETE_REGISTRATION_MUTATION = gql`
  mutation CompleteRegistration($request: SetRegistrationPersonalRequestInput!) {
    completeRegistration(request: $request) {
      accessToken
      accessExpiresAtUtc
      refreshToken
      refreshExpiresAtUtc
    }
  }
`;
