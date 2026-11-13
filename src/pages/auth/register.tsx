import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { Button } from '@fluentui/react-components';
import { LogoIcon } from '@/assets/icons';
import { AuthPageCode, AuthPageEmail, AuthPagePassword, AuthPagePersonal } from '@/components/auth';
import type { RegistrationFlow } from '@/graphql/auth';
import { useRegistration } from '@/hooks/auth/use-registration';
import { usePrivacy } from '@/hooks/privacy/use-privacy';
import { useAlerts } from '@/hooks';
import { AuthSteps } from '@/types/auth';
import { AlertPosition, AlertStatus } from '@/types';
import { authStore, routeNames } from '@/shared';

const getUrlToken = () => new URLSearchParams(window.location.hash.slice(1)).get('session');
const graphError = (error: unknown) =>
  CombinedGraphQLErrors.is(error) ? error.errors[0] : undefined;

const toAuthStep = (step: RegistrationFlow['nextStep']): AuthSteps => {
  switch (step) {
    case 'CODE':
      return AuthSteps.Code;
    case 'PASSWORD':
      return AuthSteps.Password;
    case 'PERSONAL':
      return AuthSteps.Personal;
    default:
      return AuthSteps.Email;
  }
};

export const RegisterPage = () => {
  const [step, setStep] = useState<AuthSteps>(AuthSteps.Email);
  const [sessionToken, setSessionToken] = useState<string | null>(getUrlToken);
  const [restoring, setRestoring] = useState(Boolean(getUrlToken()));
  const [restoreFailed, setRestoreFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const tokenRef = useRef(sessionToken);
  const registration = useRegistration();
  const { getCurrentConsentVersionId } = usePrivacy();
  const { addAlert } = useAlerts();
  const navigate = useNavigate();

  const clearSession = () => {
    tokenRef.current = null;
    setSessionToken(null);
    window.history.replaceState(
      window.history.state,
      '',
      window.location.pathname + window.location.search,
    );
  };

  const applyFlow = (flow: RegistrationFlow) => {
    tokenRef.current = flow.sessionToken;
    setSessionToken(flow.sessionToken);
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}#session=${encodeURIComponent(flow.sessionToken)}`,
    );
    setStep(toAuthStep(flow.nextStep));
  };

  useEffect(() => {
    const token = tokenRef.current;
    if (!token) return;

    let active = true;

    registration
      .restore(token)
      .then((flow) => {
        if (!active) return;
        if (flow) applyFlow(flow);
        else clearSession();
      })
      .catch((error: unknown) => {
        if (active) {
          if (graphError(error)?.extensions?.code === 'REGISTRATION_SESSION_MISMATCH') {
            clearSession();
            addAlert(
              'Ссылка относится к другой регистрации. Начните заново.',
              AlertStatus.Error,
              AlertPosition.TopRight,
            );
          } else {
            setRestoreFailed(true);
            addAlert(
              'Не удалось восстановить регистрацию. Повторите попытку.',
              AlertStatus.Error,
              AlertPosition.TopRight,
            );
          }
        }
      })
      .finally(() => {
        if (active) setRestoring(false);
      });

    return () => {
      active = false;
    };
    // Restore only once from the URL on initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = async (action: () => Promise<void>) => {
    if (busy) return;

    setBusy(true);
    try {
      await action();
    } catch (error) {
      const issue = graphError(error);

      if (
        issue?.extensions?.code === 'REGISTRATION_SESSION_REQUIRED' ||
        issue?.extensions?.code === 'REGISTRATION_SESSION_EXPIRED'
      ) {
        clearSession();
        setStep(AuthSteps.Email);
      } else if (issue?.extensions?.code === 'REGISTRATION_STEP_NOT_AVAILABLE') {
        const nextStep = issue.extensions.nextStep;
        if (typeof nextStep === 'string')
          setStep(toAuthStep(nextStep.toUpperCase() as RegistrationFlow['nextStep']));
      }

      addAlert(
        issue?.message ??
          (error instanceof Error
            ? error.message
            : 'Не удалось продолжить регистрацию. Попробуйте ещё раз.'),
        AlertStatus.Error,
        AlertPosition.TopRight,
      );
    } finally {
      setBusy(false);
    }
  };

  const begin = (email: string) =>
    run(async () => {
      const consentVersionId = await getCurrentConsentVersionId('PERSONAL_DATA');
      const flow = await registration.begin({
        email,
        personalDataConsent: true,
        consentVersionId,
      });

      if (!flow) throw new Error('Empty registration response');
      applyFlow(flow);
    });

  const verify = (code: string) =>
    run(async () => {
      if (!sessionToken) throw new Error('Missing registration session');

      const flow = await registration.verify({ code }, sessionToken);
      if (!flow) throw new Error('Empty registration response');
      applyFlow(flow);
    });

  const resend = async (): Promise<number> => {
    if (!sessionToken || busy) return 0;

    setBusy(true);
    try {
      await registration.resend(sessionToken);
      addAlert('Новый код отправлен на почту', AlertStatus.Success, AlertPosition.TopRight);
      return 10;
    } catch (error) {
      const issue = graphError(error);
      addAlert(
        issue?.message ?? 'Не удалось отправить код повторно',
        AlertStatus.Error,
        AlertPosition.TopRight,
      );
      return typeof issue?.extensions?.retryAfter === 'number' ? issue.extensions.retryAfter : 0;
    } finally {
      setBusy(false);
    }
  };

  const setPassword = (password: string, confirmPassword: string) =>
    run(async () => {
      if (!sessionToken) throw new Error('Missing registration session');

      const flow = await registration.setPassword({ password, confirmPassword }, sessionToken);
      if (!flow) throw new Error('Empty registration response');
      applyFlow(flow);
    });

  const complete = (name: string, surname: string) =>
    run(async () => {
      if (!sessionToken) throw new Error('Missing registration session');

      let response;

      for (let attempt = 0; attempt < 6; attempt++) {
        try {
          response = await registration.complete({ name, surname }, sessionToken);
          break;
        } catch (error) {
          if (graphError(error)?.extensions?.code !== 'CONSENT_REQUIRED' || attempt === 5)
            throw error;

          await new Promise((resolve) => window.setTimeout(resolve, 500));
        }
      }

      if (!response) throw new Error('Empty registration response');

      authStore.setSession(response);
      clearSession();
      navigate(routeNames.HOME_PAGE, { replace: true });
    });

  return (
    <div className="page__layout">
      <div className="auth-page__layout">
        <section className="auth-page__block">
          <div className="auth-page__forms-container logo-container">
            <div className="auth-page__forms-container__corner" />
            <div className="auth-page__forms-container__corner__circle" />
            <LogoIcon className="landing-header__logo" color="#ffffff" />
            <span className="logo-container__logo__title">planara</span>
            <div className="logo-container__logo__wrapper">
              <p className="landing-header__brand-caption">3D</p>
              <p className="landing-header__brand-caption">workspace</p>
            </div>
          </div>

          {restoreFailed ? (
            <Button onClick={() => window.location.reload()}>Повторить восстановление</Button>
          ) : restoring ? (
            <p>Восстанавливаем регистрацию…</p>
          ) : (
            <>
              {step === AuthSteps.Email && <AuthPageEmail onSubmit={begin} busy={busy} />}
              {step === AuthSteps.Code && (
                <AuthPageCode onSubmit={verify} onResend={resend} busy={busy} />
              )}
              {step === AuthSteps.Password && (
                <AuthPagePassword onSubmit={setPassword} busy={busy} />
              )}
              {step === AuthSteps.Personal && <AuthPagePersonal onSubmit={complete} busy={busy} />}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
