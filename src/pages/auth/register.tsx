// Core
import { useState } from 'react';
// Icons
import { LogoIcon } from '@/assets/icons';
// Components
import { AuthPageCode, AuthPageEmail, AuthPagePassword, AuthPagePersonal } from '@/components/auth';
// Types
import { AuthSteps } from '@/types/auth/auth-steps';

export const RegisterPage = () => {
  // Шаги регистрации
  const [step, setStep] = useState<AuthSteps>(AuthSteps.Email);

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
          {step === AuthSteps.Email && (
            <AuthPageEmail emitNextStep={() => setStep(AuthSteps.Code)} />
          )}
          {step === AuthSteps.Code && (
            <AuthPageCode emitNextStep={() => setStep(AuthSteps.Password)} />
          )}
          {step === AuthSteps.Password && (
            <AuthPagePassword emitNextStep={() => setStep(AuthSteps.Personal)} />
          )}
          {step === AuthSteps.Personal && (
            <AuthPagePersonal emitNextStep={() => setStep(AuthSteps.Avatar)} />
          )}
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
