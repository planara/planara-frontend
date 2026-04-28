// Types
import { DownloadPeriod, type NpmDownloadsResponse } from '@/types';

/** Получение загрузок с npm */
export const getNpmDownloads = async (packageName: string, period: DownloadPeriod) => {
  const encodedPackageName = encodeURIComponent(packageName);

  const response = await fetch(
    `https://api.npmjs.org/downloads/point/${period}/${encodedPackageName}`,
  );

  if (!response.ok) return 0;

  const data = (await response.json()) as NpmDownloadsResponse;

  return data.downloads ?? 0;
};
