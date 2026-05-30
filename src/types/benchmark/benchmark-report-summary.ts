export type BenchmarkReportSummary = {
  averageFps: number;
  minFps: number;
  averageFrameTime: number;
  maxFrameTime: number;
  objectsCount: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  memoryUsedMb: number | null;
};
