import {
  type ChangeEvent,
  type KeyboardEventHandler,
  type MouseEventHandler,
  useState,
} from 'react';
import {
  DismissRegular,
  ErrorCircleRegular,
  EyeOffRegular,
  EyeRegular,
} from '@fluentui/react-icons';

import { InputType } from '@/types/input/input-type';

type UiInputProps = {
  id: string;
  errorId: string;
  label: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  type?: InputType;
};

const UiInput = (props: UiInputProps) => {
  const {
    id,
    errorId,
    label,
    disabled = false,
    error = false,
    errorMessage,
    onChange,
    onClear,
    onKeyDown,
    value,
    type = InputType.Text,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === InputType.Password;
  const hasValue = value.trim().length > 0;

  const inputId = `${id}-input`;
  const messageId = `${id}-message`;

  const inputType = isPassword && showPassword ? InputType.Text : type;

  return (
    <div className="ui-input__container">
      <div
        id={id}
        className={[
          'ui-input',
          error ? 'ui-input--error error-input shake' : '',
          disabled ? 'ui-input--disabled' : '',
        ].join(' ')}
      >
        <input
          id={inputId}
          className="ui-input__native"
          type={inputType}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder=" "
          aria-invalid={error}
          aria-describedby={error ? errorId : undefined}
        />

        <label htmlFor={inputId} className="ui-input__label">
          {label}
        </label>

        {hasValue && !disabled && isPassword && (
          <button
            type="button"
            className="ui-input__button"
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeRegular /> : <EyeOffRegular />}
          </button>
        )}

        {hasValue && !disabled && !isPassword && onClear && (
          <button
            type="button"
            className="ui-input__button"
            aria-label="Очистить поле"
            onClick={onClear}
          >
            <DismissRegular />
          </button>
        )}
      </div>

      <div
        id={errorId}
        className={[
          'ui-input__error-message',
          error && errorMessage ? 'ui-input__error-message--visible' : 'hidden',
        ].join(' ')}
      >
        <ErrorCircleRegular className="ui-input__error-icon" />
        <span id={messageId}>{errorMessage}</span>
      </div>
    </div>
  );
};

export default UiInput;
