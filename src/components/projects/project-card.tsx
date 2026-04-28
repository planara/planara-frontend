import { ArrowRightRegular, CalendarRegular, DeleteRegular } from '@fluentui/react-icons';

export type ProjectCardData = {
  id: string;
  name: string;
  description: string | null;
  fileUrl: string;
  createdAt: string;
  updatedAt: string | null;
};

type ProjectCardProps = {
  project: ProjectCardData;
  onOpen: (projectId: string) => void;
  onDelete: (projectId: string) => void;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return 'Не обновлялся';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

export const ProjectCard = ({ project, onOpen, onDelete }: ProjectCardProps) => {
  return (
    <article className="project-card">
      <div className="project-card__preview">
        <div className="project-card__grid" />

        <div className="project-card__object">
          <div className="project-card__ring" />
          <div className="project-card__sphere" />
        </div>
      </div>

      <div className="project-card__body">
        <div className="project-card__top">
          <div className="project-card__content">
            <h3 className="project-card__title">{project.name}</h3>

            <p className="project-card__description">
              {project.description || 'Описание проекта пока не добавлено.'}
            </p>
          </div>

          <button
            className="project-card__delete"
            type="button"
            aria-label="Удалить проект"
            onClick={() => onDelete(project.id)}
          >
            <DeleteRegular />
          </button>
        </div>

        <div className="project-card__meta">
          <span>
            <CalendarRegular />
            Создан: {formatDate(project.createdAt)}
          </span>
        </div>

        <div className="project-card__footer">
          <span className="project-card__updated">Обновлен: {formatDate(project.updatedAt)}</span>

          <button className="project-card__open" type="button" onClick={() => onOpen(project.id)}>
            <span>Открыть</span>
            <ArrowRightRegular />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
