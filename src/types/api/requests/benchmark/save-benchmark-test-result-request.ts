// Types
import type { BenchmarkTestStatus } from '@planara/types';
import { BenchmarkApiTestType, type BenchmarkMetricsHistory } from '@/types/benchmark';

export type SaveBenchmarkTestResultRequest = {
  type: BenchmarkApiTestType;
  status: BenchmarkTestStatus;
  errorMessage?: string | null;
  durationMs: number;
  frames: number;
  averageFps: number;
  minFps: number;
  averageFrameTime: number;
  maxFrameTime: number;
  objectsCount: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  memoryUsedMb?: number | null;
  history: BenchmarkMetricsHistory;
};
