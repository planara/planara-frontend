// Сообщения об ошибках
import errors from './error-messages.ts';

/**
 * Проверяет корректность введённого email.
 *
 * @param {string} email - Адрес электронной почты для проверки.
 * @returns {string} Сообщение об ошибке или пустая строка, если email корректен.
 * @example
 * validateEmail('test@example.com'); // ''
 * validateEmail(''); // 'Введите адрес электронной почты или номер телефона.'
 */
export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.length === 0) {
    return errors.emptyEmail;
  } else if (!emailRegex.test(email)) {
    return errors.invalidEmail;
  }

  return '';
};

/**
 * Проверяет корректность введённого никнейма.
 *
 * @param {string} username - Никнейм для проверки.
 * @returns {string} Сообщение об ошибке или пустая строка, если никнейм корректен.
 * @example
 * validateUsername('user_123'); // ''
 * validateUsername('12'); // 'Никнейм должен содержать минимум 3 символа.'
 */
export const validateUsername = (username: string): string => {
  const hasLetters = /[a-zA-Zа-яА-ЯёЁ]/.test(username);

  if (username.length === 0) {
    return errors.emptyUsername;
  } else if (username.length < 3) {
    return errors.usernameTooShort;
  } else if (username.length > 100) {
    return errors.usernameTooLong;
  } else if (!hasLetters) {
    return errors.usernameNoLetters;
  }

  return '';
};

/**
 * Проверяет корректность пароля на соответствие требованиям:
 * длина, наличие заглавных и строчных букв, цифр и специальных символов.
 *
 * @param {string} password - Пароль для проверки.
 * @returns {string} Сообщение об ошибке или пустая строка, если пароль корректен.
 * @example
 * validatePassword('Password1!'); // ''
 * validatePassword('pass'); // 'Пароль должен содержать от 8 до 12 символов.'
 */
export const validatePassword = (password: string): string => {
  if (password.length < 8 || password.length > 12) {
    return errors.passwordLength;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars = /[!@#$%]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasDigits || !hasSpecialChars) {
    if (!hasUpperCase) return errors.passwordUpperCase;
    if (!hasLowerCase) return errors.passwordLowerCase;
    if (!hasDigits) return errors.passwordDigits;
    if (!hasSpecialChars) return errors.passwordSpecialChars;
  }

  return '';
};
