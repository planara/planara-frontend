export const formatDate = (value: string | null) => {
  if (!value) {
    return 'Не обновлялся';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};
