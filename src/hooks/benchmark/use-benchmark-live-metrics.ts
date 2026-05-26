// Core
import { useCallback, useEffect, useRef, useState } from 'react';
import { useBenchmarkHub } from '@planara/react';
// Types
import type { BenchmarkMetrics } from '@planara/types';
import type { BenchmarkMetricHistoryPoint } from '@/types/benchmark';

const HISTORY_LIMIT = 240;

export const useBenchmarkLiveMetrics = () => {
  const hub = useBenchmarkHub();

  const startedAtRef = useRef(0);

  const [metrics, setMetrics] = useState<BenchmarkMetrics | null>(null);
  const [history, setHistory] = useState<BenchmarkMetricHistoryPoint[]>([]);

  useEffect(() => {
    if (!hub) {
      return;
    }

    startedAtRef.current = performance.now();

    return hub.subscribeMetrics((nextMetrics) => {
      if (!nextMetrics) {
        setMetrics(null);
        return;
      }

      const timeMs = performance.now() - startedAtRef.current;

      setMetrics(nextMetrics);

      setHistory((prev) => {
        const next = [
          ...prev,
          {
            timeMs,
            averageFps: nextMetrics.averageFps ?? 0,
            minFps: nextMetrics.minFps ?? 0,
            averageFrameTime: nextMetrics.averageFrameTime ?? 0,
            maxFrameTime: nextMetrics.maxFrameTime ?? 0,
            memoryUsedMb: nextMetrics.memoryUsedMb ?? null,
            drawCalls: nextMetrics.drawCalls ?? 0,
            triangles: nextMetrics.triangles ?? 0,
            objectsCount: nextMetrics.objectsCount ?? 0,
          },
        ];

        return next.slice(-HISTORY_LIMIT);
      });
    });
  }, [hub]);

  const clearMetrics = useCallback(() => {
    startedAtRef.current = performance.now();

    setMetrics(null);
    setHistory([]);
  }, []);

  return {
    metrics,
    history,
    clearMetrics,
  };
};
