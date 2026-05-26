// Types
import { BenchmarkTestType, type BenchmarkReport, BenchmarkTestStatus } from '@planara/types';
import {
  BenchmarkApiTestType,
  type BenchmarkMetricHistoryPoint,
  BenchmarkRunStatus,
} from '@/types/benchmark';
import type { SaveBenchmarkRunRequest } from '@/types';

export const DEFAULT_BENCHMARK_DURATION_MS = 5_000;

export const benchmarkTests = [
  {
    type: BenchmarkTestType.Light,
    title: 'Лёгкий тест',
    description: 'Быстрая проверка базовой производительности рендера.',
  },
  {
    type: BenchmarkTestType.Medium,
    title: 'Средний тест',
    description: 'Нагрузка, приближенная к обычному пользовательскому проекту.',
  },
  {
    type: BenchmarkTestType.Heavy,
    title: 'Тяжёлый тест',
    description: 'Проверка просадок FPS и времени кадра на плотной сцене.',
  },
  {
    type: BenchmarkTestType.Mixed,
    title: 'Смешанный тест',
    description: 'Комплексная проверка на разных типах объектов.',
  },
];

export const createBenchmarkRunUrl = (tests: BenchmarkTestType[], durationMs: number) => {
  const params = new URLSearchParams();

  params.set('tests', tests.join(','));
  params.set('durationMs', String(durationMs));

  return `/benchmark/run?${params.toString()}`;
};

export const parseBenchmarkTests = (value: string | null): BenchmarkTestType[] => {
  if (!value) {
    return [];
  }

  const allowedValues = new Set(Object.values(BenchmarkTestType) as string[]);

  return value
    .split(',')
    .filter((item) => allowedValues.has(item))
    .map((item) => item as BenchmarkTestType);
};

export const getBenchmarkTestTitle = (type: BenchmarkTestType | BenchmarkApiTestType | string) => {
  const normalizedType = String(type).toUpperCase();

  if (normalizedType === 'LIGHT') {
    return 'Лёгкий тест';
  }

  if (normalizedType === 'MEDIUM') {
    return 'Средний тест';
  }

  if (normalizedType === 'HEAVY') {
    return 'Тяжёлый тест';
  }

  if (normalizedType === 'MIXED') {
    return 'Смешанный тест';
  }

  return String(type);
};

export const formatBenchmarkNumber = (value?: number | null, fractionDigits = 2) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};

export const formatBenchmarkMetric = (value?: number | null, suffix = '', fractionDigits = 2) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '—';
  }

  return `${formatBenchmarkNumber(value, fractionDigits)}${suffix}`;
};

export const formatBenchmarkDateTime = (value?: string | null) => {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const formatBenchmarkStatus = (status: string) => {
  const normalizedStatus = status.toUpperCase();

  if (
    normalizedStatus === BenchmarkRunStatus.Completed ||
    normalizedStatus === BenchmarkTestStatus.Success
  ) {
    return 'Успешно';
  }

  if (
    normalizedStatus === BenchmarkRunStatus.Failed ||
    normalizedStatus === BenchmarkTestStatus.Failed
  ) {
    return 'Ошибка';
  }

  if (normalizedStatus === BenchmarkTestStatus.Skipped) {
    return 'Пропущен';
  }

  return status;
};

const toBenchmarkApiTestType = (type: unknown): BenchmarkApiTestType => {
  const normalizedType = String(type).toUpperCase();

  if (normalizedType === BenchmarkApiTestType.Light) {
    return BenchmarkApiTestType.Light;
  }

  if (normalizedType === BenchmarkApiTestType.Medium) {
    return BenchmarkApiTestType.Medium;
  }

  if (normalizedType === BenchmarkApiTestType.Heavy) {
    return BenchmarkApiTestType.Heavy;
  }

  return BenchmarkApiTestType.Mixed;
};

const toBenchmarkApiTestStatus = (status: unknown): BenchmarkTestStatus => {
  const normalizedStatus = String(status).toUpperCase();

  if (normalizedStatus.includes('SUCCESS') || normalizedStatus.includes('PASSED')) {
    return BenchmarkTestStatus.Success;
  }

  if (normalizedStatus.includes('SKIPPED')) {
    return BenchmarkTestStatus.Skipped;
  }

  return BenchmarkTestStatus.Failed;
};

const toBenchmarkHistoryInput = (history: BenchmarkMetricHistoryPoint[]) => {
  return {
    timeMs: history.map((item) => item.timeMs),

    averageFps: history.map((item) => item.averageFps),
    minFps: history.map((item) => item.minFps),

    averageFrameTime: history.map((item) => item.averageFrameTime),
    maxFrameTime: history.map((item) => item.maxFrameTime),

    memoryUsedMb: history.map((item) => item.memoryUsedMb),

    drawCalls: history.map((item) => item.drawCalls),
    triangles: history.map((item) => item.triangles),
    objectsCount: history.map((item) => item.objectsCount),
  };
};

const getHistoryChunk = (history: BenchmarkMetricHistoryPoint[], index: number, total: number) => {
  if (total <= 1) {
    return history;
  }

  const chunkSize = Math.ceil(history.length / total);
  const start = index * chunkSize;
  const end = start + chunkSize;

  return history.slice(start, end);
};

export const createSaveBenchmarkRunRequest = (
  report: BenchmarkReport,
  history: BenchmarkMetricHistoryPoint[],
  durationMs: number,
): SaveBenchmarkRunRequest => {
  const testsCount = report.tests.length;

  const tests = report.tests.map((test, index) => {
    const metrics = test.metrics;
    const testHistory = getHistoryChunk(history, index, testsCount);

    if (!metrics) {
      return {
        type: toBenchmarkApiTestType(test.type),
        status: toBenchmarkApiTestStatus(test.status),
        errorMessage: 'error' in test ? String(test.error ?? '') || null : null,

        durationMs: 0,
        frames: 0,

        averageFps: 0,
        minFps: 0,

        averageFrameTime: 0,
        maxFrameTime: 0,

        objectsCount: 0,
        drawCalls: 0,
        triangles: 0,
        geometries: 0,
        textures: 0,

        memoryUsedMb: null,

        history: toBenchmarkHistoryInput(testHistory),
      };
    }

    return {
      type: toBenchmarkApiTestType(test.type),
      status: toBenchmarkApiTestStatus(test.status),
      errorMessage: 'error' in test ? String(test.error ?? '') || null : null,

      durationMs: metrics.durationMs,
      frames: metrics.frames,

      averageFps: metrics.averageFps,
      minFps: metrics.minFps,

      averageFrameTime: metrics.averageFrameTime,
      maxFrameTime: metrics.maxFrameTime,

      objectsCount: metrics.objectsCount,
      drawCalls: metrics.drawCalls,
      triangles: metrics.triangles,
      geometries: metrics.geometries,
      textures: metrics.textures,

      memoryUsedMb: metrics.memoryUsedMb ?? null,

      history: toBenchmarkHistoryInput(testHistory),
    };
  });

  const hasFailedTests = tests.some((test) => test.status === BenchmarkTestStatus.Failed);

  return {
    completedAt: new Date().toISOString(),
    durationMs,
    status: hasFailedTests ? BenchmarkRunStatus.Failed : BenchmarkRunStatus.Completed,
    userAgent: navigator.userAgent,
    devicePixelRatio: window.devicePixelRatio,
    tests,
  };
};
