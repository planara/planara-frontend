import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeftRegular, HomeRegular } from '@fluentui/react-icons';

import { SiteShell, UiButton } from '@/components';
import { routeNames } from '@/shared';
import { UiButtonSize, UiButtonVariant } from '@/types';

type ErrorPageProps = {
  code: string;
  title: string;
  description: string;
  icon: ReactNode;
};

export const ErrorPage = ({ code, title, description, icon }: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <SiteShell>
      <main className="error-page">
        <section className="error-page__card">
          <div className="error-page__visual">
            <div className="error-page__grid" />

            <div className="error-page__code">{code}</div>

            <div className="error-page__icon">{icon}</div>
          </div>

          <div className="error-page__content">
            <h1 className="error-page__title">{title}</h1>
            <p className="error-page__description">{description}</p>

            <div className="error-page__actions">
              <UiButton
                title="На главную"
                size={UiButtonSize.Large}
                variant={UiButtonVariant.Dark}
                onClick={() => navigate(routeNames.HOME_PAGE)}
                icon={<HomeRegular />}
              >
                На главную
              </UiButton>

              <UiButton
                title="Назад"
                size={UiButtonSize.Large}
                variant={UiButtonVariant.Light}
                onClick={() => navigate(routeNames.HOME_PAGE)}
                icon={<ArrowLeftRegular />}
              >
                Назад
              </UiButton>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
};

export default ErrorPage;
