import type { ReactNode } from 'react';

export type ProjectPreviewFieldProps = {
  title: string;
  description: string;
  dirty: boolean;
  icon: ReactNode;
  children: ReactNode;
};

export const ProjectPreviewField = ({
  title,
  description,
  dirty,
  icon,
  children,
}: ProjectPreviewFieldProps) => {
  return (
    <div
      className={['project-preview-field', dirty ? 'project-preview-field--dirty' : ''].join(' ')}
    >
      <div className="project-preview-field__top">
        <div className="project-preview-field__meta">
          <div className="project-preview-field__icon">{icon}</div>

          <div>
            <span>{title}</span>
            <small>{description}</small>
          </div>
        </div>

        {dirty && <b>Изменено</b>}
      </div>

      {children}
    </div>
  );
};

export default ProjectPreviewField;
