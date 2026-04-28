// Types
import type { JSX } from 'react';
import type { SdkPackageLink } from '@/types/sdk/sdk-package-link';

export type SdkPackageBase = {
  name: string;
  slug: string;
  type: string;
  description: string;
  installCommand: string;
  icon: JSX.Element;
  links: SdkPackageLink[];
};
