// Core
import { useEffect, useState } from 'react';
// Types
import { DownloadPeriod, type SdkPackageBase } from '@/types';
// Shared
import { getNpmDownloads } from '@/shared';

export const useNpmDownloads = (packages: SdkPackageBase[], period: DownloadPeriod) => {
  const [downloads, setDownloads] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDownloads = async () => {
      try {
        setLoading(true);

        const entries = await Promise.all(
          packages.map(async (sdkPackage) => {
            const packageDownloads = await getNpmDownloads(sdkPackage.name, period);

            return [sdkPackage.name, packageDownloads] as const;
          }),
        );

        if (!mounted) {
          return;
        }

        setDownloads(Object.fromEntries(entries));
      } catch (error) {
        console.error(error);

        if (!mounted) {
          return;
        }

        setDownloads({});
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadDownloads();

    return () => {
      mounted = false;
    };
  }, [packages, period]);

  return {
    downloads,
    loading,
  };
};
