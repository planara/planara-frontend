// Types
import { BenchmarkRunStatus } from '@/types/benchmark';
import type { BenchmarkTestResultResponse } from '@/types/api/responses';

export type BenchmarkRunResponse = {
  id: string;
  createdAt: string;
  completedAt?: string | null;
  durationMs: number;
  status: BenchmarkRunStatus;
  userAgent?: string | null;
  devicePixelRatio?: number | null;
  tests: BenchmarkTestResultResponse[];
};
