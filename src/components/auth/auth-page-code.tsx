// Core
import { useState, useEffect } from 'react';
// Components
import { Button, Text, Title1 } from '@fluentui/react-components';
import { AuthPageSteps, AuthConfirmationCode } from '@/components/auth';
// Types
import { AuthSteps } from '@/types/auth';

// Таймер повторной отправки письма с кодом
const RESEND_TIMEOUT = 20;

export const AuthPageCode = (props: { emitNextStep: () => void }) => {
  const { emitNextStep } = props;
  // Код подтверждения почты
  const [code, setCode] = useState('');

  // Кол-во секунд до возможности отправки повторного письма с кодом
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT);
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

      <form className="auth-form">
        <AuthConfirmationCode onChange={setCode} />

        <div className="auth-form__resend-code">
          {secondsLeft > 0 ? (
            <Text>
              Повторная отправка будет доступна {relativeTime.format(secondsLeft, 'second')}.
            </Text>
          ) : (
            <Button appearance="transparent">Отправить код повторно</Button>
          )}
        </div>

        <div className="auth-form__bottom">
          <Button
            appearance="primary"
            size="large"
            type="submit"
            className="auth-form__submit"
            disabled={!code || code.length !== 4}
            onClick={() => emitNextStep()}
          >
            Подтвердить
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthPageCode;
