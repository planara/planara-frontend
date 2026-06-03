// Icons
import { DeleteRegular, DismissRegular, WarningRegular } from '@fluentui/react-icons';
// Components
import { UiModal } from '@/components';

type SettingsDeleteAccountModalProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export const SettingsDeleteAccountModal = ({
  open,
  loading = false,
  onClose,
  onConfirm,
}: SettingsDeleteAccountModalProps) => {
  return (
    <UiModal open={open} onClose={onClose}>
      <div className="settings-delete-modal">
        <div className="settings-delete-modal__header">
          <div className="settings-delete-modal__icon">
            <WarningRegular />
          </div>

          <button
            className="settings-delete-modal__close"
            type="button"
            aria-label="Закрыть"
            disabled={loading}
            onClick={onClose}
          >
            <DismissRegular />
          </button>
        </div>

        <div className="settings-delete-modal__content">
          <p className="settings-section__eyebrow">Подтверждение</p>

          <h2 className="settings-delete-modal__title">Удалить аккаунт?</h2>

          <p className="settings-delete-modal__text">
            Это действие удалит аккаунт и прекратит обработку персональных данных в рамках сервиса.
            Доступ к профилю, проектам и сохранённым файлам может быть потерян без возможности
            восстановления.
          </p>

          <p className="settings-delete-modal__note">
            Если вы хотите продолжить, подтвердите удаление аккаунта. Случайное удаление отменить
            нельзя.
          </p>
        </div>

        <div className="settings-delete-modal__actions">
          <button
            className="settings-button settings-button--light"
            type="button"
            disabled={loading}
            onClick={onClose}
          >
            <span>Отмена</span>
          </button>

          <button
            className="settings-button settings-button--danger"
            type="button"
            disabled={loading}
            onClick={() => void onConfirm()}
          >
            <DeleteRegular />
            <span>{loading ? 'Удаляем...' : 'Удалить аккаунт'}</span>
          </button>
        </div>
      </div>
    </UiModal>
  );
};

export default SettingsDeleteAccountModal;
