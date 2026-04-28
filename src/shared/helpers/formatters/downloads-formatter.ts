export const formatDownloads = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value);
};
