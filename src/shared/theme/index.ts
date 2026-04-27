import { webLightTheme, webDarkTheme, type Theme } from '@fluentui/react-components';

const fontFamily =
  '"Manrope Variable", Manrope, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const lightTheme: Theme = {
  ...webLightTheme,

  colorBrandBackground: '#111111',
  colorBrandBackgroundHover: '#2a2a2a',
  colorBrandBackgroundPressed: '#000000',
  colorBrandForeground1: '#111111',
  colorBrandStroke1: '#111111',

  borderRadiusSmall: '6px',
  borderRadiusMedium: '10px',
  borderRadiusLarge: '14px',
  borderRadiusXLarge: '18px',

  fontFamilyBase: fontFamily,
  fontFamilyNumeric: fontFamily,
};

export const darkTheme: Theme = {
  ...webDarkTheme,

  colorBrandBackground: '#ffffff',
  colorBrandBackgroundHover: '#e8e8e8',
  colorBrandBackgroundPressed: '#d4d4d4',
  colorBrandForeground1: '#ffffff',
  colorBrandStroke1: '#ffffff',

  fontFamilyBase: fontFamily,
  fontFamilyNumeric: fontFamily,
};
