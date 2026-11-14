// Core
import { type SubmitEvent, useState } from 'react';
// Components
import { Button, Checkbox, Link, Text, Title1, Tooltip } from '@fluentui/react-components';
import { UiInput } from '@/components';
// Types
import { InputType } from '@/types';
// Helpers
import { clearError, routeNames, triggerShake, validateEmail } from '@/shared';
// Icons
import { GoogleIcon, GithubIcon, YandexIcon, VkIcon, AppleIcon } from '@/assets/icons';

export const AuthPageEmail = (props: {
  onSubmit: (email: string) => Promise<void>;
  busy: boolean;
}) => {
  const { onSubmit, busy } = props;

  // Адрес электронной почты
  const [email, setEmail] = useState('');
  // Согласие на обработку персональных данных
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = validateEmail(email.trim());
    if (message) {
      triggerShake('email', message);
      return;
    }
    if (consent) await onSubmit(email.trim().toLowerCase());
  };

  return (
    <div className="auth-page__forms-container form-container">
      <div className="auth-page__forms-container__corner" />
      <div className="auth-page__forms-container__corner__circle" />

      <div className="auth-form__header">
        <div className="auth-form__title-block">
          <Title1 className="auth-form__title">Создать аккаунт</Title1>

          <Text className="auth-form__subtitle">
            Зарегистрируйтесь, чтобы начать работу в редакторе
          </Text>
        </div>
      </div>

      <div className="auth-form__oauth-section">
        <Tooltip content="Появится позже" relationship="description">
          <div
            className="auth-form__oauth-section__icon disabled"
            role="button"
            aria-disabled="true"
            aria-label="Вход через Google"
            tabIndex={0}
          >
            <GoogleIcon />
          </div>
        </Tooltip>
        <Tooltip content="Появится позже" relationship="description">
          <div
            className="auth-form__oauth-section__icon disabled"
            role="button"
            aria-disabled="true"
            aria-label="Вход через GitHub"
            tabIndex={0}
          >
            <GithubIcon />
          </div>
        </Tooltip>
        <Tooltip content="Появится позже" relationship="description">
          <div
            className="auth-form__oauth-section__icon disabled"
            role="button"
            aria-disabled="true"
            aria-label="Вход через Яндекс"
            tabIndex={0}
          >
            <YandexIcon />
          </div>
        </Tooltip>
        <Tooltip content="Появится позже" relationship="description">
          <div
            className="auth-form__oauth-section__icon disabled"
            role="button"
            aria-disabled="true"
            aria-label="Вход через VK"
            tabIndex={0}
          >
            <VkIcon />
          </div>
        </Tooltip>
        <Tooltip content="Появится позже" relationship="description">
          <div
            className="auth-form__oauth-section__icon disabled"
            role="button"
            aria-disabled="true"
            aria-label="Вход через Apple"
            tabIndex={0}
          >
            <AppleIcon />
          </div>
        </Tooltip>
      </div>

      <div className="auth-form__alternative-method">или</div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <UiInput
          id="email"
          errorId="email-error"
          label="Адрес электронной почты"
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

        <Checkbox
          className="auth-form__consent"
          checked={consent}
          onChange={(_, data) => {
            setConsent(Boolean(data.checked));
          }}
          label={
            <span>
              Я принимаю <Link href={routeNames.TERMS_PAGE}>Правила пользования</Link> и даю
              согласие на обработку персональных данных для создания аккаунта и работы сервиса в
              соответствии с{' '}
              <Link href={routeNames.PRIVACY_POLICY_PAGE}>Политикой конфиденциальности</Link>.
            </span>
          }
        />

        <Button
          appearance="primary"
          size="large"
          type="submit"
          className="auth-form__submit"
          disabled={!consent || busy}
        >
          Продолжить
        </Button>

        <div className="auth-form__footer">
          <Text className="auth-form__footer-text">Уже есть аккаунт?</Text>

          <Link href={routeNames.LOGIN_PAGE} className="auth-form__footer-link">
            Войти
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AuthPageEmail;
