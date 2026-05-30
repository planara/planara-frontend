const LandingShowcase = () => {
  return (
    <section id="editor" className="landing-editor-showcase">
      <div className="landing-editor-showcase__header">
        <div>
          <p className="landing-section__eyebrow">Превью редактора</p>

          <h2 className="landing-editor-showcase__title">Рабочая сцена прямо в браузере</h2>
        </div>
      </div>

      <div className="landing-editor-frame">
        <div className="landing-editor-frame__topbar">
          <div className="landing-editor-frame__dots">
            <span />
            <span />
            <span />
          </div>

          <span>Рабочее пространство</span>
        </div>

        <div className="landing-editor-frame__body">
          <video
            className="landing-editor-frame__video"
            src="/assets/editor-preview.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/editor-preview-poster.png"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingShowcase;
