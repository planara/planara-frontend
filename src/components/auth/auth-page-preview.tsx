// Components
import { Text } from '@fluentui/react-components';

export const AuthPagePreview = () => {
  return (
    <div className="auth-page__preview">
      <div className="auth-page__preview-header">
        <div className="auth-page__preview-logo">P</div>
        <Text className="auth-page__preview-brand">Planara</Text>
      </div>

      <div className="auth-page__preview-content">
        <div className="auth-page__preview-scene">
          <img
            className="auth-page__preview-image"
            src="/assets/editor-poster.png"
            alt="Превью редактора Planara"
          />
        </div>

        <div className="auth-page__preview-caption">
          <Text className="auth-page__preview-title">Создавайте сцены быстрее</Text>

          <Text className="auth-page__preview-description">
            Пространство для визуального редактирования, управления объектами и подготовки
            интерактивных проектов.
          </Text>
        </div>
      </div>
    </div>
  );
};
