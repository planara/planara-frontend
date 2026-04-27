import { type SubmitEvent, useState } from 'react';

import { DismissRegular, SaveRegular } from '@fluentui/react-icons';

import UiInput from '@/components/input';

type CreateProjectForm = {
  name: string;
  description: string;
};

type CreateProjectModalProps = {
  onClose: () => void;
  onCreate: (data: CreateProjectForm) => void;
};

const createEmptyForm = (): CreateProjectForm => ({
  name: '',
  description: '',
});

export const CreateProjectModal = ({ onClose, onCreate }: CreateProjectModalProps) => {
  const [form, setForm] = useState<CreateProjectForm>(() => createEmptyForm());

  const updateField = (field: keyof CreateProjectForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    onCreate({
      name: form.name.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <form className="create-project-modal" onSubmit={handleSubmit}>
      <div className="create-project-modal__header">
        <div>
          <p className="projects-section__eyebrow">Новый проект</p>

          <h2 className="create-project-modal__title">Создать проект</h2>
        </div>

        <button className="create-project-modal__close" type="button" onClick={onClose}>
          <DismissRegular />
        </button>
      </div>

      <div className="create-project-modal__fields">
        <UiInput
          id="project-name"
          errorId="project-name-error"
          label="Название проекта"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          onClear={() => updateField('name', '')}
        />

        <UiInput
          id="project-description"
          errorId="project-description-error"
          label="Описание"
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          onClear={() => updateField('description', '')}
        />
      </div>

      <div className="create-project-modal__actions">
        <button className="projects-button projects-button--light" type="button" onClick={onClose}>
          Отмена
        </button>

        <button className="projects-button projects-button--dark" type="submit">
          <SaveRegular />
          <span>Создать</span>
        </button>
      </div>
    </form>
  );
};

export default CreateProjectModal;
