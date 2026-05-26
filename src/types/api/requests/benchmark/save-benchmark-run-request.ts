// Types
import { BenchmarkRunStatus } from '@/types/benchmark';
import type { SaveBenchmarkTestResultRequest } from '@/types/api/requests';

export type SaveBenchmarkRunRequest = {
  completedAt?: string | null;
  durationMs: number;
  status: BenchmarkRunStatus;
  userAgent?: string | null;
  devicePixelRatio?: number | null;
  tests: SaveBenchmarkTestResultRequest[];
};
