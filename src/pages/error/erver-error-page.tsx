import { DismissCircleRegular } from '@fluentui/react-icons';

import ErrorPage from './error-page';

export const ServerErrorPage = () => {
  return (
    <ErrorPage
      code="500"
      title="Что-то пошло не так"
      description="Произошла внутренняя ошибка. Попробуйте обновить страницу или вернуться позже."
      icon={<DismissCircleRegular />}
    />
  );
};

export default ServerErrorPage;
