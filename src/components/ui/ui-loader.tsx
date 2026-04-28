import { BeatLoader } from 'react-spinners';

type UiLoaderSize = 'tiny' | 'small' | 'medium' | 'large';
type UiLoaderVariant = 'dark' | 'light' | 'muted';

type UiLoaderProps = {
  size?: UiLoaderSize;
  variant?: UiLoaderVariant;
  label?: string;
  centered?: boolean;
  inline?: boolean;
};

const loaderSizeMap: Record<UiLoaderSize, number> = {
  tiny: 4,
  small: 6,
  medium: 8,
  large: 10,
};

const loaderColorMap: Record<UiLoaderVariant, string> = {
  dark: '#111111',
  light: '#ffffff',
  muted: '#777777',
};

export const UiLoader = ({
  size = 'small',
  variant = 'dark',
  label,
  centered = false,
  inline = false,
}: UiLoaderProps) => {
  return (
    <span
      className={[
        'ui-loader',
        centered ? 'ui-loader--centered' : '',
        inline ? 'ui-loader--inline' : '',
      ].join(' ')}
      role="status"
      aria-live="polite"
      aria-label={label || 'Загрузка'}
    >
      <BeatLoader
        size={loaderSizeMap[size]}
        color={loaderColorMap[variant]}
        speedMultiplier={0.85}
      />

      {label && <span className="ui-loader__label">{label}</span>}
    </span>
  );
};

export default UiLoader;
