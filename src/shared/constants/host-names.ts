/**
 * Пути для роутинга
 *
 * @const
 */
export const routeNames = {
  /** Лендинг */
  LANDING_PAGE: '/',

  /** Главная страница */
  HOME_PAGE: '/home',

  /** Страница входа */
  LOGIN_PAGE: '/login',

  /** Страница регистрации */
  REGISTER_PAGE: '/register',

  /** Страница редактора */
  EDITOR_PAGE: '/projects/:projectId',

  /** Страница проектов */
  PROJECTS_PAGE: '/projects',

  /** Страница настроек */
  SETTINGS_PAGE: '/settings',

  /** Страница sdk */
  SDK_PAGE: '/sdk',

  /** Страница ошибки сервера */
  SERVER_ERROR_PAGE: '/500',

  /** Страница документации sdk */
  SDK_DOCS_PAGE: '/sdk/:packageSlug/docs',
  SDK_DOCS_PAGE_DEEP: '/sdk/:packageSlug/docs/:sectionSlug',
};
