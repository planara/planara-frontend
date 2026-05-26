// Apollo
import { gql } from '@apollo/client';
// Types
import type { BenchmarkRunListItemResponse, BenchmarkRunResponse } from '@/types';

export type BenchmarkRunsQueryData = {
  myBenchmarkRuns: {
    totalCount: number;
    nodes: BenchmarkRunListItemResponse[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type BenchmarkRunsQueryVariables = {
  first: number;
  after?: string | null;
};

export const BENCHMARK_RUNS_QUERY = gql`
  query BenchmarkRuns($first: Int, $after: String) {
    myBenchmarkRuns(first: $first, after: $after) {
      totalCount
      nodes {
        id
        createdAt
        completedAt
        durationMs
        status
        testsCount
        userAgent
        devicePixelRatio
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export type BenchmarkRunQueryData = {
  benchmarkRun: BenchmarkRunResponse;
};

export type BenchmarkRunQueryVariables = {
  request: {
    runId: string;
  };
};

export const BENCHMARK_RUN_QUERY = gql`
  query BenchmarkRun($request: GetBenchmarkRunRequestInput!) {
    benchmarkRun(request: $request) {
      id
      createdAt
      completedAt
      durationMs
      status
      userAgent
      devicePixelRatio
      tests {
        id
        type
        status
        errorMessage
        durationMs
        frames
        averageFps
        minFps
        averageFrameTime
        maxFrameTime
        objectsCount
        drawCalls
        triangles
        geometries
        textures
        memoryUsedMb
        history {
          timeMs
          averageFps
          minFps
          averageFrameTime
          maxFrameTime
          memoryUsedMb
          drawCalls
          triangles
          objectsCount
        }
      }
    }
  }
`;
