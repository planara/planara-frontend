// Core
import { useState } from 'react';
// Components
import { AuthPageSteps, UiInput } from '@/components';
import { Button, Text, Title1 } from '@fluentui/react-components';
// Types
import { AuthSteps } from '@/types/auth';
import { InputType } from '@/types';
// Helpers
import { clearError } from '@/shared';

export const AuthPagePersonal = (props: { emitNextStep: () => void }) => {
  const { emitNextStep } = props;
  // Отображаемое имя пользователя
  const [username, setUsername] = useState('');
  // Имя
  const [name, setName] = useState('');
  // Фамилия
  const [surname, setSurname] = useState('');

  return (
    <div className="auth-page__forms-container form-container">
      <div className="auth-page__forms-container__corner" />
      <div className="auth-page__forms-container__corner__circle" />

      <div className="auth-form__header">
        <AuthPageSteps step={AuthSteps.Personal} />
        <div className="auth-form__title-block">
          <Title1 className="auth-form__title">Расскажите о себе</Title1>

          <Text className="auth-form__subtitle">
            Укажите имя, фамилию и уникальный username для вашего профиля.
          </Text>
        </div>
      </div>

      <form className="auth-form">
        <UiInput
          id="username"
          errorId="username-error"
          label="Отображаемое имя"
          type={InputType.Text}
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            clearError('username');
          }}
          onClear={() => {
            setUsername('');
            clearError('username');
          }}
        />

        <UiInput
          id="name"
          errorId="name-error"
          label="Имя"
          type={InputType.Text}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            clearError('name');
          }}
          onClear={() => {
            setName('');
            clearError('name');
          }}
        />

        <UiInput
          id="surname"
          errorId="surname-error"
          label="Фамилия"
          type={InputType.Text}
          value={surname}
          onChange={(event) => {
            setSurname(event.target.value);
            clearError('surname');
          }}
          onClear={() => {
            setSurname('');
            clearError('surname');
          }}
        />

        <div className="auth-form__bottom">
          <Button
            appearance="primary"
            size="large"
            type="submit"
            className="auth-form__submit"
            onClick={() => emitNextStep()}
          >
            Подтвердить
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthPagePersonal;
