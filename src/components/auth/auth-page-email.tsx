// Core
import { useState } from 'react';
// Components
import { Button, Checkbox, Link, Text, Title1 } from '@fluentui/react-components';
import { UiInput } from '@/components';
// Types
import { InputType } from '@/types';
// Helpers
import { clearError, routeNames } from '@/shared';
// Icons
import { GoogleIcon, GithubIcon, YandexIcon, VkIcon, AppleIcon } from '@/assets/icons';

export const AuthPageEmail = (props: { emitNextStep: () => void }) => {
  const { emitNextStep } = props;

  // Адрес электронной почты
  const [email, setEmail] = useState('');
  // Согласие на обработку персональных данных
  const [consent, setConsent] = useState(false);

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
        <div className="auth-form__oauth-section__icon">
          <GoogleIcon />
        </div>
        <div className="auth-form__oauth-section__icon">
          <GithubIcon />
        </div>
        <div className="auth-form__oauth-section__icon">
          <YandexIcon />
        </div>
        <div className="auth-form__oauth-section__icon">
          <VkIcon />
        </div>
        <div className="auth-form__oauth-section__icon">
          <AppleIcon />
        </div>
      </div>

      <div className="auth-form__alternative-method">или</div>

      <form className="auth-form">
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
          disabled={!consent || email.length === 0}
          onClick={emitNextStep}
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
