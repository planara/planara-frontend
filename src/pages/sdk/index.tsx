// Core
import { useMemo } from 'react';
// Hooks
import { useNpmDownloads } from '@/hooks';
// Components
import { SiteShell, UiPageHero, SdkPackagesSection } from '@/components';
// Types
import { DownloadPeriod } from '@/types';
// Shared
import { sdkPackages } from '@/shared';

const DOWNLOAD_PERIOD: DownloadPeriod = DownloadPeriod.LastYear;

export const SdkPage = () => {
  const { downloads, loading: downloadsLoading } = useNpmDownloads(sdkPackages, DOWNLOAD_PERIOD);

  const packagesWithDownloads = useMemo(() => {
    return sdkPackages.map((sdkPackage) => ({
      ...sdkPackage,
      downloads: downloads[sdkPackage.name] ?? 0,
    }));
  }, [downloads]);

  const totalDownloads = packagesWithDownloads.reduce((sum, sdkPackage) => {
    return sum + sdkPackage.downloads;
  }, 0);

  return (
    <SiteShell>
      <main className="sdk-page">
        <UiPageHero
          badge="Planara SDK"
          title="SDK для редактора Planara"
          subtitle="Набор пакетов для интеграции 3D-редактора, React-адаптера, Three.js-слоя и общих TypeScript-контрактов."
        />

        <SdkPackagesSection
          packages={packagesWithDownloads}
          totalDownloads={totalDownloads}
          downloadsLoading={downloadsLoading}
        />
      </main>
    </SiteShell>
  );
};

export default SdkPage;
