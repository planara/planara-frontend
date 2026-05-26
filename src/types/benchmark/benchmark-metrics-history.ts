export type BenchmarkMetricsHistory = {
  timeMs: number[];
  averageFps: number[];
  minFps: number[];
  averageFrameTime: number[];
  maxFrameTime: number[];
  memoryUsedMb: Array<number | null>;
  drawCalls: number[];
  triangles: number[];
  objectsCount: number[];
};
