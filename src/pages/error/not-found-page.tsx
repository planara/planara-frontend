import { SearchRegular } from '@fluentui/react-icons';

import ErrorPage from './error-page';

export const NotFoundPage = () => {
  return (
    <ErrorPage
      code="404"
      title="Страница не найдена"
      description="Похоже, такого маршрута не существует или страница была перемещена."
      icon={<SearchRegular />}
    />
  );
};

export default NotFoundPage;
