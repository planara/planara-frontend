// Types
import type { SdkPackageBase } from '@/types';
// Shared
import { formatDownloads } from '@/shared';
// Components
import { UiLoader, UiSectionPanel, SdkPackageCard } from '@/components';

type SdkPackagesSectionProps = {
  packages: Array<
    SdkPackageBase & {
      downloads: number;
    }
  >;
  totalDownloads: number;
  downloadsLoading: boolean;
};

export const SdkPackagesSection = ({
  packages,
  totalDownloads,
  downloadsLoading,
}: SdkPackagesSectionProps) => {
  return (
    <UiSectionPanel
      eyebrow="Пакеты"
      title="Доступные модули"
      badges={[
        `${packages.length} пакета`,
        downloadsLoading ? (
          <UiLoader size="tiny" variant="muted" inline />
        ) : (
          `${formatDownloads(totalDownloads)} скачиваний`
        ),
      ]}
    >
      <div className="sdk-grid">
        {packages.map((sdkPackage, index) => (
          <SdkPackageCard
            key={sdkPackage.name}
            sdkPackage={sdkPackage}
            downloadsLoading={downloadsLoading}
            index={index}
          />
        ))}
      </div>
    </UiSectionPanel>
  );
};

export default SdkPackagesSection;
