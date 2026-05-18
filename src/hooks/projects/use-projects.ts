// Apollo
import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
// Queries / Mutations
import {
  CREATE_PROJECT_MUTATION,
  DELETE_PROJECT_MUTATION,
  PROJECTS_QUERY,
  PROJECT_QUERY,
  UPDATE_PROJECT_MUTATION,
  type CreateProjectMutationData,
  type CreateProjectMutationVariables,
  type DeleteProjectMutationData,
  type DeleteProjectMutationVariables,
  type ProjectQueryData,
  type ProjectQueryVariables,
  type ProjectsQueryData,
  type ProjectsQueryVariables,
  type UpdateProjectMutationData,
  type UpdateProjectMutationVariables,
} from '@/graphql/projects';
// Types
import type { CreateProjectRequest, DeleteProjectRequest, UpdateProjectRequest } from '@/types';

const PROJECTS_PAGE_SIZE = 20;

export const useProjects = (projectId?: string) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
    fetchMore,
  } = useQuery<ProjectsQueryData, ProjectsQueryVariables>(PROJECTS_QUERY, {
    variables: {
      first: PROJECTS_PAGE_SIZE,
      after: null,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
    refetch: refetchProject,
  } = useQuery<ProjectQueryData, ProjectQueryVariables>(PROJECT_QUERY, {
    variables: {
      request: {
        projectId: projectId ?? '',
      },
    },
    skip: !projectId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [createProjectMutation, createProjectState] = useMutation<
    CreateProjectMutationData,
    CreateProjectMutationVariables
  >(CREATE_PROJECT_MUTATION);

  const [updateProjectMutation, updateProjectState] = useMutation<
    UpdateProjectMutationData,
    UpdateProjectMutationVariables
  >(UPDATE_PROJECT_MUTATION);

  const [deleteProjectMutation, deleteProjectState] = useMutation<
    DeleteProjectMutationData,
    DeleteProjectMutationVariables
  >(DELETE_PROJECT_MUTATION);

  const createProject = async (request: CreateProjectRequest) => {
    const response = await createProjectMutation({
      variables: {
        request,
      },
    });

    return response.data?.createProject;
  };

  const updateProject = async (request: UpdateProjectRequest) => {
    const response = await updateProjectMutation({
      variables: {
        request,
      },
    });

    return response.data?.updateProject;
  };

  const deleteProject = async (request: DeleteProjectRequest) => {
    const response = await deleteProjectMutation({
      variables: {
        request,
      },
    });

    return response.data?.deleteProject;
  };

  const loadMoreProjects = async () => {
    const pageInfo = projectsData?.myProjects.pageInfo;

    if (!pageInfo?.hasNextPage || loadingMore) {
      return;
    }

    try {
      setLoadingMore(true);

      await fetchMore({
        variables: {
          first: PROJECTS_PAGE_SIZE,
          after: pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          return {
            myProjects: {
              ...fetchMoreResult.myProjects,
              nodes: [
                ...(previousResult.myProjects.nodes ?? []),
                ...(fetchMoreResult.myProjects.nodes ?? []),
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
    projects: projectsData?.myProjects.nodes ?? [],
    pageInfo: projectsData?.myProjects.pageInfo,

    project: projectData?.project,

    createProject,
    updateProject,
    deleteProject,
    loadMoreProjects,

    refetchProjects,
    refetchProject,

    loading:
      projectsLoading ||
      projectLoading ||
      createProjectState.loading ||
      updateProjectState.loading ||
      deleteProjectState.loading,

    error:
      projectsError ||
      projectError ||
      createProjectState.error ||
      updateProjectState.error ||
      deleteProjectState.error,

    projectsLoading,
    projectsError,

    projectLoading,
    projectError,

    createProjectLoading: createProjectState.loading,
    createProjectError: createProjectState.error,

    updateProjectLoading: updateProjectState.loading,
    updateProjectError: updateProjectState.error,

    deleteProjectLoading: deleteProjectState.loading,
    deleteProjectError: deleteProjectState.error,

    loadingMore,
  };
};
