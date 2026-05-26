// Shared
import { workflowSteps } from '@/shared';

export const LandingWorkflow = () => {
  return (
    <section className="landing-workflow">
      <div className="landing-workflow__header">
        <p className="landing-section__eyebrow">Workflow</p>
        <h2 className="landing-workflow__title">От проекта до готовой сцены</h2>
      </div>

      <div className="landing-workflow__steps">
        {workflowSteps.map((step, index) => (
          <article key={step.title} className="landing-workflow-step">
            <span className="landing-workflow-step__number">
              {String(index + 1).padStart(2, '0')}
            </span>

            <h3 className="landing-workflow-step__title">{step.title}</h3>

            <p className="landing-workflow-step__description">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LandingWorkflow;
