// Core
import { type SubmitEvent, useState } from 'react';
// Components
import { AuthPageSteps, UiInput } from '@/components';
import { Button, Text, Title1 } from '@fluentui/react-components';
// Types
import { AuthSteps } from '@/types/auth';
import { InputType } from '@/types';
// Helpers
import { clearError, triggerShake, validatePassword } from '@/shared';

export const AuthPagePassword = (props: { emitNextStep: () => void }) => {
  const { emitNextStep } = props;
  // Пароль
  const [password, setPassword] = useState('');
  // Подтвержденный пароль
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const passwordMessage = validatePassword(password);

    const repeatPasswordMessage =
      repeatPassword.length === 0
        ? 'Повторите пароль'
        : repeatPassword !== password
          ? 'Пароли не совпадают'
          : '';

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

    const hasErrors = passwordMessage.length > 0 || repeatPasswordMessage.length > 0;

    if (hasErrors) {
      return;
    }

    emitNextStep();
  };

  return (
    <div className="auth-page__forms-container form-container">
      <div className="auth-page__forms-container__corner" />
      <div className="auth-page__forms-container__corner__circle" />

      <div className="auth-form__header">
        <AuthPageSteps step={AuthSteps.Password} />
        <div className="auth-form__title-block">
          <Title1 className="auth-form__title">Создайте пароль</Title1>

          <Text className="auth-form__subtitle">
            Придумайте пароль для безопасного доступа к аккаунту.
          </Text>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
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

        <div className="auth-form__bottom">
          <Button appearance="primary" size="large" type="submit" className="auth-form__submit">
            Подтвердить
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthPagePassword;
