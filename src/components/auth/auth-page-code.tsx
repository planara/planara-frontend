// Core
import { type SubmitEvent, useState, useEffect } from 'react';
// Components
import { Button, Text, Title1 } from '@fluentui/react-components';
import { AuthPageSteps, AuthConfirmationCode } from '@/components/auth';
// Types
import { AuthSteps } from '@/types/auth';

// Таймер повторной отправки письма с кодом
const RESEND_TIMEOUT = 10;

export const AuthPageCode = (props: {
  onSubmit: (code: string) => Promise<void>;
  onResend: () => Promise<number>;
  busy: boolean;
}) => {
  const { onSubmit, onResend, busy } = props;
  // Код подтверждения почты
  const [code, setCode] = useState('');

  // Кол-во секунд до возможности отправки повторного письма с кодом
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT);
  const [codeKey, setCodeKey] = useState(0);
  const relativeTime = new Intl.RelativeTimeFormat('ru', {
    numeric: 'always',
  });

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [secondsLeft]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (/^\d{4}$/.test(code)) await onSubmit(code);
  };

  const handleResend = async () => {
    const cooldown = await onResend();
    if (cooldown > 0) {
      setSecondsLeft(cooldown);
      setCode('');
      setCodeKey((value) => value + 1);
    }
  };

  return (
    <div className="auth-page__forms-container form-container">
      <div className="auth-page__forms-container__corner" />
      <div className="auth-page__forms-container__corner__circle" />

      <div className="auth-form__header">
        <AuthPageSteps step={AuthSteps.Code} />
        <div className="auth-form__title-block">
          <Title1 className="auth-form__title">Подтвердите почту</Title1>

          <Text className="auth-form__subtitle">
            Мы отправили 4-значный код на указанную почту. Если письма нет, проверьте папку «Спам».
          </Text>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthConfirmationCode key={codeKey} onChange={setCode} />

        <div className="auth-form__resend-code">
          {secondsLeft > 0 ? (
            <Text>
              Повторная отправка будет доступна {relativeTime.format(secondsLeft, 'second')}.
            </Text>
          ) : (
            <Button type="button" appearance="transparent" disabled={busy} onClick={handleResend}>
              Отправить код повторно
            </Button>
          )}
        </div>

        <div className="auth-form__bottom">
          <Button
            appearance="primary"
            size="large"
            type="submit"
            className="auth-form__submit"
            disabled={!/^\d{4}$/.test(code) || busy}
          >
            Подтвердить
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthPageCode;
