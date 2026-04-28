import { type SubmitEvent, useState } from 'react';

import { DismissRegular, SaveRegular } from '@fluentui/react-icons';

import UiInput from '@/components/input';
import { UiButton } from '@/components/ui';
import { UiButtonVariant } from '@/types';

export type CreateProjectData = {
  name: string;
  description: string;
};

type CreateProjectModalProps = {
  onClose: () => void;
  onCreate: (data: CreateProjectData) => void;
};

const createEmptyForm = (): CreateProjectData => ({
  name: '',
  description: '',
});

export const CreateProjectModal = ({ onClose, onCreate }: CreateProjectModalProps) => {
  const [form, setForm] = useState<CreateProjectData>(() => createEmptyForm());

  const updateField = (field: keyof CreateProjectData, value: string) => {
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
          <p className="ui-section-header__eyebrow">Новый проект</p>
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
        <UiButton variant={UiButtonVariant.Light} onClick={onClose}>
          Отмена
        </UiButton>

        <UiButton variant={UiButtonVariant.Dark} type="submit" icon={<SaveRegular />}>
          Создать
        </UiButton>
      </div>
    </form>
  );
};

export default CreateProjectModal;
