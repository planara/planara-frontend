// Core
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
// Components
import { UiIconBox, UiLoader } from '@/components';
// Icons
import { ArrowRightRegular } from '@fluentui/react-icons';
// Types
import { type SdkPackageBase, UiIconBoxVariant } from '@/types';
// Shared
import { formatDownloads } from '@/shared';

type SdkPackageCardProps = {
  sdkPackage: SdkPackageBase & {
    downloads: number;
  };
  downloadsLoading: boolean;
  index: number;
};

const isExternalLink = (href: string) => {
  return href.startsWith('http');
};

export const SdkPackageCard = ({ sdkPackage, downloadsLoading, index }: SdkPackageCardProps) => {
  return (
    <article
      className="sdk-card sdk-card--animated"
      style={{ animationDelay: `${index * 110}ms` } as CSSProperties}
    >
      <div className="sdk-card__top">
        <UiIconBox icon={sdkPackage.icon} variant={UiIconBoxVariant.Dark} />

        <span className="sdk-card__type">{sdkPackage.type}</span>
      </div>

      <div className="sdk-card__content">
        <h3 className="sdk-card__title">{sdkPackage.name}</h3>

        <p className="sdk-card__description">{sdkPackage.description}</p>
      </div>

      <div className="sdk-card__install">
        <code>{sdkPackage.installCommand}</code>
      </div>

      <div className="sdk-card__meta">
        <div className="sdk-card__downloads">
          {downloadsLoading ? (
            <UiLoader size="tiny" variant="muted" inline />
          ) : (
            `${formatDownloads(sdkPackage.downloads)} скачиваний`
          )}
        </div>

        <div className="sdk-card__links">
          {sdkPackage.links.map((link) => {
            if (isExternalLink(link.href)) {
              return (
                <a
                  key={link.label}
                  className="sdk-card__icon-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                >
                  {link.icon}
                </a>
              );
            }

            return (
              <Link
                key={link.label}
                className="sdk-card__icon-link"
                to={link.href}
                aria-label={link.label}
                title={link.label}
              >
                {link.icon}
              </Link>
            );
          })}
        </div>
      </div>

      <Link className="sdk-card__link" to={`/sdk/${sdkPackage.slug}/docs`}>
        <span>Подробнее</span>
        <ArrowRightRegular />
      </Link>
    </article>
  );
};

export default SdkPackageCard;
