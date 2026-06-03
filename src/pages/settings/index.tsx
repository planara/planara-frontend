// Core
import { useEffect, useMemo, useState, type SubmitEvent } from 'react';
// Icons
import {
  ArrowClockwiseRegular,
  DeleteRegular,
  EditRegular,
  LinkRegular,
  PersonRegular,
  SaveRegular,
  SignOutRegular,
  SparkleRegular,
  WarningRegular,
} from '@fluentui/react-icons';
// Components
import {
  AppShell,
  SettingsDeleteAccountModal,
  SettingsInputField,
  UiButton,
  UiPageHero,
} from '@/components';
// Hooks
import { useAccount, useAuth, useLoading, useAlerts } from '@/hooks';
// Types
import {
  AlertPosition,
  AlertStatus,
  InputType,
  type ProfileResponse,
  type UpdateProfileRequest,
  type ProfileFieldKey,
  type ProfileForm,
  UiButtonSize,
  UiButtonVariant,
} from '@/types';
// Shared
import { authStore, routeNames } from '@/shared';

const PROFILE_FIELDS: ProfileFieldKey[] = [
  'username',
  'displayName',
  'name',
  'surname',
  'avatarUrl',
  'bio',
];

const profileToForm = (profile?: ProfileResponse | null): ProfileForm => {
  return {
    username: profile?.username ?? '',
    displayName: profile?.displayName ?? '',
    name: profile?.name ?? '',
    surname: profile?.surname ?? '',
    avatarUrl: profile?.avatarUrl ?? '',
    bio: profile?.bio ?? '',
  };
};

export const SettingsPage = () => {
  const { profile, loading, error, updateProfile } = useAccount();
  const { logout, deleteAccount } = useAuth();

  const { startLoading, stopLoading } = useLoading();
  const { addAlert } = useAlerts();

  const [formChanges, setFormChanges] = useState<Partial<ProfileForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const initialForm = useMemo(() => {
    return profileToForm(profile);
  }, [profile]);

  const form = useMemo(() => {
    return {
      ...initialForm,
      ...formChanges,
    };
  }, [initialForm, formChanges]);

  useEffect(() => {
    if (loading) {
      startLoading();
      return;
    }

    stopLoading();
  }, [loading, startLoading, stopLoading]);

  useEffect(() => {
    return () => {
      stopLoading();
    };
  }, [stopLoading]);

  useEffect(() => {
    if (!error) {
      return;
    }

    addAlert('Не удалось загрузить профиль', AlertStatus.Error, AlertPosition.TopRight);
  }, [error, addAlert]);

  const dirtyFields = useMemo(() => {
    return PROFILE_FIELDS.reduce(
      (acc, field) => {
        acc[field] = form[field] !== initialForm[field];
        return acc;
      },
      {} as Record<ProfileFieldKey, boolean>,
    );
  }, [form, initialForm]);

  const dirtyRequest = useMemo(() => {
    return PROFILE_FIELDS.reduce((acc, field) => {
      if (dirtyFields[field]) {
        acc[field] = form[field];
      }

      return acc;
    }, {} as UpdateProfileRequest);
  }, [dirtyFields, form]);

  const dirtyCount = PROFILE_FIELDS.filter((field) => dirtyFields[field]).length;
  const hasChanges = dirtyCount > 0;
  const isBusy = isSubmitting || isLoggingOut || isDeletingAccount || loading;

  const updateField = (field: ProfileFieldKey, value: string) => {
    setFormChanges((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormChanges({});
  };

  const openDeleteModal = () => {
    if (isBusy) {
      return;
    }

    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeletingAccount) {
      return;
    }

    setDeleteModalOpen(false);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasChanges || isBusy) {
      return;
    }

    try {
      setIsSubmitting(true);
      startLoading();

      const updatedProfile = await updateProfile(dirtyRequest);

      if (!updatedProfile) {
        addAlert('Не удалось сохранить изменения', AlertStatus.Error, AlertPosition.TopRight);
        return;
      }

      setFormChanges({});

      addAlert('Профиль успешно обновлён', AlertStatus.Success, AlertPosition.TopRight);
    } catch (error) {
      console.error(error);

      addAlert('Не удалось сохранить изменения', AlertStatus.Error, AlertPosition.TopRight);
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  const handleLogout = async () => {
    if (isBusy) {
      return;
    }

    const refreshToken = authStore.getRefreshToken;

    if (!refreshToken) {
      authStore.logout();
      window.location.replace(routeNames.LOGIN_PAGE);
      return;
    }

    try {
      setIsLoggingOut(true);
      startLoading();

      const response = await logout({
        refreshToken,
      });

      if (!response?.success) {
        addAlert('Не удалось выйти из аккаунта', AlertStatus.Error, AlertPosition.TopRight);
        return;
      }

      authStore.logout();

      addAlert('Вы вышли из аккаунта', AlertStatus.Success, AlertPosition.TopRight);

      window.location.replace(routeNames.LOGIN_PAGE);
    } catch (error) {
      console.error(error);

      addAlert('Не удалось выйти из аккаунта', AlertStatus.Error, AlertPosition.TopRight);
    } finally {
      setIsLoggingOut(false);
      stopLoading();
    }
  };

  const handleDeleteAccount = async () => {
    if (isBusy) {
      return;
    }

    try {
      setIsDeletingAccount(true);
      startLoading();

      const response = await deleteAccount();

      if (!response?.success) {
        addAlert('Не удалось удалить аккаунт', AlertStatus.Error, AlertPosition.TopRight);
        return;
      }

      setDeleteModalOpen(false);

      authStore.logout();

      addAlert('Аккаунт удалён', AlertStatus.Success, AlertPosition.TopRight);

      window.location.replace(routeNames.LOGIN_PAGE);
    } catch (error) {
      console.error(error);

      addAlert('Не удалось удалить аккаунт', AlertStatus.Error, AlertPosition.TopRight);
    } finally {
      setIsDeletingAccount(false);
      stopLoading();
    }
  };

  return (
    <AppShell>
      <main className="settings-page">
        <section className="settings-hero settings-hero--single">
          <UiPageHero
            badgeIcon={<SparkleRegular />}
            badge="Настройки профиля"
            title="Настройте профиль"
          />
        </section>

        <form className="settings-form-card settings-form-card--wide" onSubmit={handleSubmit}>
          <div className="settings-card-header">
            <div>
              <p className="settings-section__eyebrow">Данные профиля</p>
              <h2 className="settings-card-header__title">Основная информация</h2>
            </div>

            <div className="settings-card-header__actions">
              {hasChanges && <span className="settings-changes-count">{dirtyCount} измен.</span>}

              <UiButton
                title="Сбросить"
                size={UiButtonSize.Medium}
                disabled={!hasChanges || isBusy}
                variant={UiButtonVariant.Light}
                icon={<ArrowClockwiseRegular />}
                onClick={resetForm}
              >
                Сбросить
              </UiButton>

              <UiButton
                title="Сохранить"
                size={UiButtonSize.Medium}
                disabled={!hasChanges || isBusy}
                type="submit"
                variant={UiButtonVariant.Dark}
                icon={<SaveRegular />}
              >
                Сохранить
              </UiButton>
            </div>
          </div>

          {!loading && !error && (
            <div className="settings-fields">
              <div className="settings-fields__row">
                <SettingsInputField
                  field="username"
                  label="Никнейм"
                  description="Уникальный никнейм пользователя"
                  value={form.username}
                  dirty={dirtyFields.username}
                  icon={<PersonRegular />}
                  onChange={updateField}
                />

                <SettingsInputField
                  field="displayName"
                  label="Отображаемое имя"
                  description="Имя, которое будет видно в интерфейсе"
                  value={form.displayName}
                  dirty={dirtyFields.displayName}
                  icon={<EditRegular />}
                  onChange={updateField}
                />
              </div>

              <div className="settings-fields__row">
                <SettingsInputField
                  field="name"
                  label="Имя"
                  description="Личное имя пользователя"
                  value={form.name}
                  dirty={dirtyFields.name}
                  icon={<PersonRegular />}
                  onChange={updateField}
                />

                <SettingsInputField
                  field="surname"
                  label="Фамилия"
                  description="Фамилия пользователя"
                  value={form.surname}
                  dirty={dirtyFields.surname}
                  icon={<PersonRegular />}
                  onChange={updateField}
                />
              </div>

              <SettingsInputField
                field="avatarUrl"
                label="Ссылка на аватар"
                description="URL изображения для публичного профиля"
                value={form.avatarUrl}
                dirty={dirtyFields.avatarUrl}
                icon={<LinkRegular />}
                type={InputType.Text}
                onChange={updateField}
              />

              <SettingsInputField
                field="bio"
                label="Описание"
                description="Короткий текст о пользователе"
                value={form.bio}
                dirty={dirtyFields.bio}
                icon={<EditRegular />}
                onChange={updateField}
              />
            </div>
          )}
        </form>

        <section className="settings-form-card settings-form-card--wide settings-logout-card">
          <div>
            <p className="settings-section__eyebrow">Аккаунт</p>
            <h2 className="settings-card-header__title">Сессия</h2>
            <p className="settings-logout-card__text">
              Вы можете завершить текущую сессию. Refresh token будет отозван на сервере.
            </p>
          </div>

          <button
            className="settings-button settings-button--danger"
            type="button"
            disabled={isBusy}
            onClick={handleLogout}
          >
            <SignOutRegular />
            <span>Выйти из аккаунта</span>
          </button>
        </section>

        <section className="settings-form-card settings-form-card--wide settings-danger-card">
          <div className="settings-danger-card__content">
            <div className="settings-danger-card__icon">
              <WarningRegular />
            </div>

            <div>
              <p className="settings-section__eyebrow">Опасная зона</p>

              <h2 className="settings-card-header__title">Удаление аккаунта</h2>

              <p className="settings-danger-card__text">
                Аккаунт, данные профиля, токены доступа и связанные с пользователем данные будут
                удалены. После удаления восстановить доступ к аккаунту и проектам невозможно.
              </p>
            </div>
          </div>

          <button
            className="settings-button settings-button--danger"
            type="button"
            disabled={isBusy}
            onClick={openDeleteModal}
          >
            <DeleteRegular />
            <span>Удалить аккаунт</span>
          </button>
        </section>

        <SettingsDeleteAccountModal
          open={deleteModalOpen}
          loading={isDeletingAccount}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteAccount}
        />
      </main>
    </AppShell>
  );
};

export default SettingsPage;
