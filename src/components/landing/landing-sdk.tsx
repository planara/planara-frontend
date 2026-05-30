// Core
import { useMemo } from 'react';
// Routing
import { Link } from 'react-router-dom';
// Icons
import { ArrowRightRegular } from '@fluentui/react-icons';
// Types
import { DownloadPeriod } from '@/types';
// Hooks
import { useNpmDownloads } from '@/hooks';
// Shared
import { sdkPackages } from '@/shared';
import { UiLoader } from '@/components';

const DOWNLOAD_PERIOD: DownloadPeriod = DownloadPeriod.LastYear;

export const LandingSdk = () => {
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
    <section id="sdk" className="landing-sdk">
      <div className="landing-sdk__content">
        <p className="landing-section__eyebrow">SDK</p>

        <h2 className="landing-sdk__title">Пакеты для интеграции редактора</h2>

        <p className="landing-sdk__text">
          Редактор можно встроить в собственный продукт по частям: использовать ядро, React-адаптер,
          общие типы и вспомогательные пакеты без привязки к готовому интерфейсу.
        </p>

        <div className="landing-sdk__stats">
          <div className="landing-sdk__stat">
            <span>Скачиваний за год</span>
            {downloadsLoading ? (
              <UiLoader size="tiny" variant="light" inline />
            ) : (
              <strong>{new Intl.NumberFormat('ru-RU').format(totalDownloads)}</strong>
            )}
          </div>

          <div className="landing-sdk__stat">
            <span>Число пакетов</span>
            <strong>4</strong>
          </div>
        </div>

        <Link className="landing-sdk__link" to="/sdk">
          <span>Перейти к SDK</span>
          <ArrowRightRegular />
        </Link>
      </div>
    </section>
  );
};

export default LandingSdk;
