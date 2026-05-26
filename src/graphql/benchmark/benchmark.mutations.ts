// Apollo
import { gql } from '@apollo/client';
// Types
import type {
  BenchmarkRunResponse,
  DeleteBenchmarkRunRequest,
  DeleteBenchmarkRunResponse,
  SaveBenchmarkRunRequest,
} from '@/types';

export type SaveBenchmarkRunMutationData = {
  saveBenchmarkRun: BenchmarkRunResponse;
};

export type SaveBenchmarkRunMutationVariables = {
  request: SaveBenchmarkRunRequest;
};

export const SAVE_BENCHMARK_RUN_MUTATION = gql`
  mutation SaveBenchmarkRun($request: SaveBenchmarkRunRequestInput!) {
    saveBenchmarkRun(request: $request) {
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

export type DeleteBenchmarkRunMutationData = {
  deleteBenchmarkRun: DeleteBenchmarkRunResponse;
};

export type DeleteBenchmarkRunMutationVariables = {
  request: DeleteBenchmarkRunRequest;
};

export const DELETE_BENCHMARK_RUN_MUTATION = gql`
  mutation DeleteBenchmarkRun($request: DeleteBenchmarkRunRequestInput!) {
    deleteBenchmarkRun(request: $request) {
      success
    }
  }
`;
