export type BenchmarkMetricHistoryPoint = {
  timeMs: number;
  averageFps: number;
  minFps: number;
  averageFrameTime: number;
  maxFrameTime: number;
  memoryUsedMb: number | null;
  drawCalls: number;
  triangles: number;
  objectsCount: number;
};
