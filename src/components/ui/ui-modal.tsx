import type { ReactNode } from 'react';
import { useEffect } from 'react';

type UiModalProps = {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
};

export const UiModal = ({ open, children, onClose }: UiModalProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="ui-modal" role="dialog" aria-modal="true">
      <button
        className="ui-modal__backdrop"
        type="button"
        aria-label="Закрыть модальное окно"
        onClick={onClose}
      />

      <div className="ui-modal__content">{children}</div>
    </div>
  );
};

export default UiModal;
