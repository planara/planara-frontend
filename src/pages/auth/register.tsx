// Core
import { type SubmitEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Hooks
import { useAuth, useLoading, useAlerts } from '@/hooks';
// Components
import { Button, Checkbox, Link, Text, Title1 } from '@fluentui/react-components';
import { AuthPagePreview, UiInput } from '@/components';
// Types
import { InputType, AlertStatus, AlertPosition } from '@/types';
// Helpers
import {
  validateEmail,
  validatePassword,
  clearError,
  triggerShake,
  authStore,
  routeNames,
} from '@/shared';

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [consent, setConsent] = useState(false);

  const { register } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const { addAlert } = useAlerts();

  const navigate = useNavigate();

  const processRegister = async () => {
    try {
      startLoading();

      const response = await register({
        email: email.trim().toLowerCase(),
        password,
        consent,
      });

      if (!response) {
        addAlert('Не удалось создать аккаунт', AlertStatus.Error, AlertPosition.TopRight);
        return;
      }

      authStore.setSession({
        accessToken: response.accessToken,
        accessExpiresAtUtc: response.accessExpiresAtUtc,
        refreshToken: response.refreshToken,
        refreshExpiresAtUtc: response.refreshExpiresAtUtc,
      });

      addAlert('Аккаунт успешно создан', AlertStatus.Success, AlertPosition.TopRight);

      navigate(routeNames.HOME_PAGE);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';

      if (message.includes('Email already registered')) {
        triggerShake('email', 'Пользователь с таким email уже зарегистрирован');

        addAlert(
          'Пользователь с таким email уже зарегистрирован',
          AlertStatus.Error,
          AlertPosition.TopRight,
        );

        return;
      }

      if (
        message.includes('Consent') ||
        message.includes('consent') ||
        message.includes('согласие')
      ) {
        addAlert(
          'Для регистрации необходимо согласие на обработку персональных данных',
          AlertStatus.Error,
          AlertPosition.TopRight,
        );

        return;
      }

      addAlert('Произошла ошибка при регистрации', AlertStatus.Error, AlertPosition.TopRight);
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!consent) {
      return;
    }

    const emailMessage = validateEmail(email);
    const passwordMessage = validatePassword(password);

    const repeatPasswordMessage =
      repeatPassword.length === 0
        ? 'Повторите пароль'
        : repeatPassword !== password
          ? 'Пароли не совпадают'
          : '';

    if (emailMessage.length > 0) {
      triggerShake('email', emailMessage);
    } else {
      clearError('email');
    }

    if (passwordMessage.length > 0) {
      triggerShake('password', passwordMessage);
    } else {
      clearError('password');
    }

    if (repeatPasswordMessage.length > 0) {
      triggerShake('repeat-password', repeatPasswordMessage);
    } else {
      clearError('repeat-password');
    }

    const hasErrors =
      emailMessage.length > 0 || passwordMessage.length > 0 || repeatPasswordMessage.length > 0;

    if (hasErrors) {
      return;
    }

    await processRegister();
  };

  return (
    <div className="page__layout">
      <div className="auth-page__layout">
        <section className="auth-page__block left-block">
          <AuthPagePreview />
        </section>

        <section className="auth-page__block right-block">
          <div className="auth-page__forms-container">
            <div className="auth-form__header">
              <div className="auth-form__title-block">
                <Title1 className="auth-form__title">Создать аккаунт</Title1>

                <Text className="auth-form__subtitle">
                  Зарегистрируйтесь, чтобы начать работу в редакторе
                </Text>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <UiInput
                id="email"
                errorId="email-error"
                label="Email"
                type={InputType.Email}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearError('email');
                }}
                onClear={() => {
                  setEmail('');
                  clearError('email');
                }}
              />

              <UiInput
                id="password"
                errorId="password-error"
                label="Пароль"
                type={InputType.Password}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearError('password');
                  clearError('repeat-password');
                }}
                onClear={() => {
                  setPassword('');
                  clearError('password');
                  clearError('repeat-password');
                }}
              />

              <UiInput
                id="repeat-password"
                errorId="repeat-password-error"
                label="Повторите пароль"
                type={InputType.Password}
                value={repeatPassword}
                onChange={(event) => {
                  setRepeatPassword(event.target.value);
                  clearError('repeat-password');
                }}
                onClear={() => {
                  setRepeatPassword('');
                  clearError('repeat-password');
                }}
              />

              <Checkbox
                className="auth-form__consent"
                checked={consent}
                onChange={(_, data) => {
                  setConsent(Boolean(data.checked));
                }}
                label={
                  <span>
                    Я принимаю{' '}
                    <Link href={routeNames.TERMS_PAGE}>Правила пользования</Link> и даю согласие
                    на обработку персональных данных для создания аккаунта и работы сервиса в
                    соответствии с{' '}
                    <Link href={routeNames.PRIVACY_POLICY_PAGE}>
                      Политикой конфиденциальности
                    </Link>
                    .
                  </span>
                }
              />

              <Button
                appearance="primary"
                size="large"
                type="submit"
                className="auth-form__submit"
                disabled={!consent}
              >
                Зарегистрироваться
              </Button>

              <div className="auth-form__footer">
                <Text className="auth-form__footer-text">Уже есть аккаунт?</Text>

                <Link href={routeNames.LOGIN_PAGE} className="auth-form__footer-link">
                  Войти
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
