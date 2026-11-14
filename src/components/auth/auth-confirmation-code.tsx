// Core
import { type ChangeEvent, type ClipboardEvent, type KeyboardEvent, useRef, useState } from 'react';
// Длина кода подтверждения
const CODE_LENGTH = 4;

type AuthConfirmationCodeProps = {
  onChange?: (code: string) => void;
};

export const AuthConfirmationCode = ({ onChange }: AuthConfirmationCodeProps) => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const updateCode = (nextCode: string[]) => {
    setCode(nextCode);
    onChange?.(nextCode.join(''));
  };

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');

    if (!value) {
      const nextCode = [...code];
      nextCode[index] = '';

      updateCode(nextCode);

      return;
    }

    const nextCode = [...code];

    nextCode[index] = value.at(-1) ?? '';

    updateCode(nextCode);

    if (index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      if (code[index]) {
        const nextCode = [...code];
        nextCode[index] = '';

        updateCode(nextCode);

        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedCode = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);

    if (!pastedCode) {
      return;
    }

    const nextCode = Array(CODE_LENGTH).fill('');

    pastedCode.split('').forEach((digit, index) => {
      nextCode[index] = digit;
    });

    updateCode(nextCode);

    const focusIndex = Math.min(pastedCode.length, CODE_LENGTH - 1);

    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="auth-form__confirmation-code">
      {code.map((value, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          className="auth-form__confirmation-code__field"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={value}
          aria-label={`Цифра ${index + 1}`}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};
