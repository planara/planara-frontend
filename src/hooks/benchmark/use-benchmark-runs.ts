import { useState } from 'react';
// Apollo
import { useMutation, useQuery } from '@apollo/client/react';
// Queries / Mutations
import {
  BENCHMARK_RUN_QUERY,
  BENCHMARK_RUNS_QUERY,
  DELETE_BENCHMARK_RUN_MUTATION,
  SAVE_BENCHMARK_RUN_MUTATION,
  type BenchmarkRunQueryData,
  type BenchmarkRunQueryVariables,
  type BenchmarkRunsQueryData,
  type BenchmarkRunsQueryVariables,
  type DeleteBenchmarkRunMutationData,
  type DeleteBenchmarkRunMutationVariables,
  type SaveBenchmarkRunMutationData,
  type SaveBenchmarkRunMutationVariables,
} from '@/graphql/benchmark';
// Types
import type { DeleteBenchmarkRunRequest, SaveBenchmarkRunRequest } from '@/types';

const BENCHMARK_RUNS_PAGE_SIZE = 10;

export const useBenchmarkRuns = (runId?: string, first = BENCHMARK_RUNS_PAGE_SIZE) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    data: runsData,
    loading: runsLoading,
    error: runsError,
    refetch: refetchRuns,
    fetchMore,
  } = useQuery<BenchmarkRunsQueryData, BenchmarkRunsQueryVariables>(BENCHMARK_RUNS_QUERY, {
    variables: {
      first,
      after: null,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: runData,
    loading: runLoading,
    error: runError,
    refetch: refetchRun,
  } = useQuery<BenchmarkRunQueryData, BenchmarkRunQueryVariables>(BENCHMARK_RUN_QUERY, {
    variables: {
      request: {
        runId: runId ?? '',
      },
    },
    skip: !runId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [saveBenchmarkRunMutation, saveBenchmarkRunState] = useMutation<
    SaveBenchmarkRunMutationData,
    SaveBenchmarkRunMutationVariables
  >(SAVE_BENCHMARK_RUN_MUTATION);

  const [deleteBenchmarkRunMutation, deleteBenchmarkRunState] = useMutation<
    DeleteBenchmarkRunMutationData,
    DeleteBenchmarkRunMutationVariables
  >(DELETE_BENCHMARK_RUN_MUTATION);

  const saveBenchmarkRun = async (request: SaveBenchmarkRunRequest) => {
    const response = await saveBenchmarkRunMutation({
      variables: {
        request,
      },
      refetchQueries: [BENCHMARK_RUNS_QUERY],
    });

    return response.data?.saveBenchmarkRun;
  };

  const deleteBenchmarkRun = async (request: DeleteBenchmarkRunRequest) => {
    const response = await deleteBenchmarkRunMutation({
      variables: {
        request,
      },
      refetchQueries: [BENCHMARK_RUNS_QUERY],
    });

    return response.data?.deleteBenchmarkRun;
  };

  const loadMoreBenchmarkRuns = async () => {
    const pageInfo = runsData?.myBenchmarkRuns.pageInfo;

    if (!pageInfo?.hasNextPage || loadingMore) {
      return;
    }

    try {
      setLoadingMore(true);

      await fetchMore({
        variables: {
          first,
          after: pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          return {
            myBenchmarkRuns: {
              ...fetchMoreResult.myBenchmarkRuns,
              nodes: [
                ...(previousResult.myBenchmarkRuns.nodes ?? []),
                ...(fetchMoreResult.myBenchmarkRuns.nodes ?? []),
              ],
            },
          };
        },
      });
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    runs: runsData?.myBenchmarkRuns.nodes ?? [],
    totalCount: runsData?.myBenchmarkRuns.totalCount ?? 0,
    pageInfo: runsData?.myBenchmarkRuns.pageInfo,

    run: runData?.benchmarkRun,

    saveBenchmarkRun,
    deleteBenchmarkRun,
    loadMoreBenchmarkRuns,

    refetchRuns,
    refetchRun,

    loading:
      runsLoading || runLoading || saveBenchmarkRunState.loading || deleteBenchmarkRunState.loading,

    error: runsError || runError || saveBenchmarkRunState.error || deleteBenchmarkRunState.error,

    runsLoading,
    runsError,

    runLoading,
    runError,

    saveBenchmarkRunLoading: saveBenchmarkRunState.loading,
    saveBenchmarkRunError: saveBenchmarkRunState.error,

    deleteBenchmarkRunLoading: deleteBenchmarkRunState.loading,
    deleteBenchmarkRunError: deleteBenchmarkRunState.error,

    loadingMore,
  };
};
