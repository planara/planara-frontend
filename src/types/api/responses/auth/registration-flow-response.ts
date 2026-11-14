/** Ответ пошаговой регистрации */
export type RegistrationFlowResponse = {
  /** Токен сессии для URL */
  sessionToken: string;

  /** Текущий шаг регистрации */
  step: number;

  /** Следующий шаг регистрации */
  nextStep: number;
};
