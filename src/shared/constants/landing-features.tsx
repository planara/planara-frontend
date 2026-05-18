// Icons
import { CodeRegular, CubeRegular, LayerRegular } from '@fluentui/react-icons';

export const features = [
  {
    title: '3D-редактор в браузере',
    description:
      'Создавайте и редактируйте сцены прямо в веб-интерфейсе без установки десктопных приложений.',
    icon: <CubeRegular />,
  },
  {
    title: 'Работа с проектами',
    description: 'Сохраняйте сцены как проекты и возвращайтесь к ним из личного кабинета.',
    icon: <LayerRegular />,
  },
  {
    title: 'React SDK',
    description: 'Подключайте редактор, canvas и хуки через собственные npm-пакеты Planara.',
    icon: <CodeRegular />,
  },
];

export const geometryBlocks = [
  {
    eyebrow: 'Vertex editing',
    title: 'Редактирование вершин',
    description:
      'Переключайтесь в режим вершин и точечно меняйте форму объекта. Такой подход позволяет работать не только с целой фигурой, но и с её геометрией.',
    demoTitle: 'Vertex mode',
    demoCaption: 'Выбор и трансформация отдельных точек',
    reversed: false,
  },
  {
    eyebrow: 'Edge editing',
    title: 'Работа с рёбрами',
    description:
      'Выделяйте рёбра модели и изменяйте структуру объекта через режим edge-selection. Это делает редактор ближе к полноценным инструментам моделирования.',
    demoTitle: 'Edge mode',
    demoCaption: 'Редактирование связей между вершинами',
    reversed: true,
  },
  {
    eyebrow: 'Transform tools',
    title: 'Translate, rotate и scale',
    description:
      'Для объектов и элементов геометрии доступны базовые инструменты трансформации: перемещение, вращение и масштабирование.',
    demoTitle: 'Transform',
    demoCaption: 'Инструменты управления формой и положением',
    reversed: false,
  },
];

export const workflowSteps = [
  {
    title: 'Создайте проект',
    description: 'Новый workspace создаётся из личного кабинета и сразу готов к работе.',
  },
  {
    title: 'Откройте редактор',
    description: 'Работайте с объектами, режимами выделения и инструментами трансформации.',
  },
  {
    title: 'Сохраните сцену',
    description: 'Файл проекта хранится на сервере и доступен при следующем открытии.',
  },
];
