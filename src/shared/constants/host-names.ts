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

  /** Страница проектов */
  PROJECTS_PAGE: '/projects',

  /** Страница предпросмотра проекта */
  PROJECT_PAGE_PREVIEW: '/projects/:projectId/preview',

  /** Страница создания проекта */
  CREATE_PROJECT_PAGE: '/projects/create',

  /** Страница редактора */
  EDITOR_PAGE: '/projects/:projectId/edit',

  /** Страница настроек */
  SETTINGS_PAGE: '/settings',

  /** Страница sdk */
  SDK_PAGE: '/sdk',

  /** Страница ошибки сервера */
  SERVER_ERROR_PAGE: '/500',

  /** Страница документации sdk */
  SDK_DOCS_PAGE: '/sdk/:packageSlug/docs',
  SDK_DOCS_PAGE_DEEP: '/sdk/:packageSlug/docs/:sectionSlug',

  /** Страница бенчмарка */
  BENCHMARK_RUNS_PAGE: '/benchmark',
  CREATE_BENCHMARK_RUN_PAGE: '/benchmark/create',
  BENCHMARK_EXECUTION_PAGE: '/benchmark/run',
  BENCHMARK_RUN_PAGE: '/benchmark/:runId',
};
