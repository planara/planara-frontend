// Icons
import { BoxRegular, CodeRegular, DocumentRegular } from '@fluentui/react-icons';
// Types
import type { SdkPackageBase } from '@/types/sdk/sdk-package-base';

export const sdkPackages: SdkPackageBase[] = [
  {
    name: '@planara/core',
    slug: 'core',
    type: 'Ядро редактора',
    description:
      'Ядро редактора: API для работы со сценой, объектами, менеджерами, хендлерами, состоянием и событиями.',
    installCommand: 'npm install @planara/core',
    icon: <BoxRegular />,
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/@planara/core', icon: <BoxRegular /> },
      { label: 'GitHub', href: 'https://github.com/planara/planara-core', icon: <CodeRegular /> },
      { label: 'Docs', href: '/sdk/core/docs', icon: <DocumentRegular /> },
    ],
  },
  {
    name: '@planara/three',
    slug: 'three',
    type: 'Three.js расширения',
    description:
      'Расширения Three.js для работы со сценой, камерой, объектами, трансформациями, raycast и WebGL-рендерингом.',
    installCommand: 'npm install @planara/three',
    icon: <BoxRegular />,
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/@planara/three', icon: <BoxRegular /> },
      { label: 'GitHub', href: 'https://github.com/planara/planara-three', icon: <CodeRegular /> },
      { label: 'Docs', href: '/sdk/three/docs', icon: <DocumentRegular /> },
    ],
  },
  {
    name: '@planara/types',
    slug: 'types',
    type: 'Общие типы',
    description:
      'Общие TypeScript-типы: фигуры, инструменты, режимы редактора, состояние сцены и публичные API-контракты.',
    installCommand: 'npm install @planara/types',
    icon: <CodeRegular />,
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/@planara/types', icon: <BoxRegular /> },
      { label: 'GitHub', href: 'https://github.com/planara/planara-types', icon: <CodeRegular /> },
      { label: 'Docs', href: '/sdk/types/docs', icon: <DocumentRegular /> },
    ],
  },
  {
    name: '@planara/react',
    slug: 'react',
    type: 'React-компоненты',
    description:
      'React-компоненты для подключения редактора во фронтенд-приложение: canvas, provider, хуки и слой интеграции.',
    installCommand: 'npm install @planara/react',
    icon: <CodeRegular />,
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/@planara/react', icon: <BoxRegular /> },
      { label: 'GitHub', href: 'https://github.com/planara/planara-react', icon: <CodeRegular /> },
      { label: 'Docs', href: '/sdk/react/docs', icon: <DocumentRegular /> },
    ],
  },
];
