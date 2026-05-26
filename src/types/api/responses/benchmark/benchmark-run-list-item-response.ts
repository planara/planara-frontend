// Types
import { BenchmarkRunStatus } from '@/types/benchmark';

export type BenchmarkRunListItemResponse = {
  id: string;
  createdAt: string;
  completedAt?: string | null;
  durationMs: number;
  status: BenchmarkRunStatus;
  testsCount: number;
  userAgent?: string | null;
  devicePixelRatio?: number | null;
};
