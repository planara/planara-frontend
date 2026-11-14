import { type SubmitEvent, useState } from 'react';
import { Button, Text, Title1 } from '@fluentui/react-components';
import { AuthPageSteps, UiInput } from '@/components';
import { AuthSteps } from '@/types/auth';
import { InputType } from '@/types';

export const AuthPageAvatar = (props: {
  onFinish: (avatarUrl?: string) => Promise<void>;
  busy: boolean;
}) => {
  const { onFinish, busy } = props;
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onFinish(avatarUrl.trim() || undefined);
  };

  return (
    <div className="auth-page__forms-container form-container">
      <div className="auth-page__forms-container__corner" />
      <div className="auth-page__forms-container__corner__circle" />
      <div className="auth-form__header">
        <AuthPageSteps step={AuthSteps.Avatar} />
        <div className="auth-form__title-block">
          <Title1 className="auth-form__title">Добавьте аватар</Title1>
          <Text className="auth-form__subtitle">
            Можно указать ссылку на изображение или сделать это позже в настройках профиля.
          </Text>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <UiInput
          id="avatar-url"
          errorId="avatar-url-error"
          label="Ссылка на изображение"
          type={InputType.Text}
          value={avatarUrl}
          onChange={(event) => setAvatarUrl(event.target.value)}
          onClear={() => setAvatarUrl('')}
        />
        <div className="auth-form__bottom">
          <Button
            appearance="primary"
            size="large"
            type="submit"
            className="auth-form__submit"
            disabled={busy}
          >
            {avatarUrl.trim() ? 'Сохранить и продолжить' : 'Пропустить'}
          </Button>
        </div>
      </form>
    </div>
  );
};
