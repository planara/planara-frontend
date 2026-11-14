/**
 * Шаги регистрации
 *
 * @public
 * @enum
 */
export enum AuthSteps {
  /** Адрес электронной почты */
  Email = 'email',

  /** Подтверждение почты */
  Code = 'code',

  /** Пароль */
  Password = 'password',

  /** Персональная информация */
  Personal = 'personal',

  /** Аватарка */
  Avatar = 'avatar',
}
