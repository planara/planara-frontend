// Components
import UiInput from '@/components/input';
// Types
import type { ChangeEvent, ReactNode } from 'react';
import { InputType } from '@/types/input/input-type';
import type { ProfileFieldKey } from '@/types/profile/profile-form.ts';

type SettingsInputFieldProps = {
  field: ProfileFieldKey;
  label: string;
  description: string;
  value: string;
  dirty: boolean;
  icon: ReactNode;
  type?: InputType;
  onChange: (field: ProfileFieldKey, value: string) => void;
};

export const SettingsInputField = ({
  field,
  label,
  description,
  value,
  dirty,
  icon,
  type = InputType.Text,
  onChange,
}: SettingsInputFieldProps) => {
  const inputId = `settings-${field}`;
  const errorId = `settings-${field}-error`;

  return (
    <div className={['settings-field', dirty ? 'settings-field--dirty' : ''].join(' ')}>
      <div className="settings-field__top">
        <div className="settings-field__meta">
          <div className="settings-field__icon">{icon}</div>

          <div className="settings-field__text">
            <span className="settings-field__label">{label}</span>
            <span className="settings-field__description">{description}</span>
          </div>
        </div>

        {dirty && <span className="settings-field__badge">Изменено</span>}
      </div>

      <UiInput
        id={inputId}
        errorId={errorId}
        label={label}
        type={type}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(field, event.target.value);
        }}
        onClear={() => {
          onChange(field, '');
        }}
      />
    </div>
  );
};

export default SettingsInputField;
