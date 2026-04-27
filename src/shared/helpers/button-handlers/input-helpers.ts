// Types
import type { InputElements } from '@/types/input/input-elements.ts';

const getInputElements = (id: string): InputElements | null => {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}-error`);
  const messageElement = document.getElementById(`${id}-message`);

  if (!input || !error || !messageElement) {
    return null;
  }

  return {
    input,
    error,
    messageElement,
    nativeInput: input.querySelector('input'),
  };
};

/**
 * Запускает анимацию ошибки для инпута и отображает сообщение.
 */
export const triggerShake = (id: string, message: string) => {
  const elements = getInputElements(id);

  if (!elements) {
    return;
  }

  const { input, error, messageElement, nativeInput } = elements;

  input.classList.remove('ui-input--error');
  void input.offsetWidth;
  input.classList.add('ui-input--error');

  error.classList.remove('hidden');
  error.classList.add('ui-input__error-message--visible');

  messageElement.textContent = message;

  nativeInput?.setAttribute('aria-invalid', 'true');
  nativeInput?.setAttribute('aria-describedby', `${id}-error`);
};

/**
 * Очищает сообщение об ошибке и сбрасывает состояние ошибки.
 */
export const clearError = (id: string) => {
  const elements = getInputElements(id);

  if (!elements) {
    return;
  }

  const { input, error, messageElement, nativeInput } = elements;

  input.classList.remove('ui-input--error');

  error.classList.remove('ui-input__error-message--visible');
  error.classList.add('hidden');

  messageElement.textContent = '';

  nativeInput?.setAttribute('aria-invalid', 'false');
  nativeInput?.removeAttribute('aria-describedby');
};
