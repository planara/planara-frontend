/** Запрос для начала регистрации */
export type BeginRegistrationRequest = {
  /** Адрес электронной почты пользователя */
  email: string;

  /** Согласие на обработку персональных данных */
  personalDataConsent: boolean;

  /** ID версии согласия на обработку персональных данных */
  consentVersionId: string;
};
