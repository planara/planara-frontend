// Types
import { AuthSteps } from '@/types/auth';
// Icons
import { CheckmarkIcon } from '@/assets/icons';

const steps = [
  {
    step: AuthSteps.Email,
    label: 'Почта',
  },
  {
    step: AuthSteps.Code,
    label: 'Код',
  },
  {
    step: AuthSteps.Password,
    label: 'Пароль',
  },
  {
    step: AuthSteps.Personal,
    label: 'Профиль',
  },
  {
    step: AuthSteps.Avatar,
    label: 'Аватар',
  },
];

export const AuthPageSteps = (props: { step: AuthSteps }) => {
  const { step } = props;

  const currentStepIndex = steps.findIndex((item) => item.step === step);

  return (
    <div className="auth-form__registration-steps">
      {steps.map((item, index) => {
        const isCompleted = index < currentStepIndex;
        const isDisabled = index > currentStepIndex;
        const isActive = index === currentStepIndex;

        return (
          <>
            {index > 0 && (
              <div
                className={`auth-form__registration-steps__separator ${
                  index <= currentStepIndex ? 'completed' : ''
                }`}
              />
            )}

            <div
              className={[
                'auth-form__registration-step__wrapper',
                isCompleted ? 'completed' : '',
                isDisabled ? 'disabled' : '',
                isActive ? 'active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="auth-form__registration-step">
                {isCompleted ? <CheckmarkIcon /> : index + 1}
              </div>

              <span>{item.label}</span>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default AuthPageSteps;
