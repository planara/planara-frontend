const GithubIcon = () => {
  return (
    <svg
      className="app-footer__github-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.99c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
};

export const AppFooter = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div>
          <p className="app-footer__brand">Planara</p>
          <p className="app-footer__text">Веб-пространство для создания и управления 3D-сценами.</p>
        </div>

        <div className="app-footer__meta">
          <span>© {new Date().getFullYear()} Planara</span>
          <span>React · Three.js · TypeScript</span>
          <a
            className="app-footer__github"
            href="https://github.com/planara"
            target="_blank"
            rel="noreferrer"
            aria-label="Открыть GitHub"
          >
            <GithubIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
