// Apollo
import { gql } from '@apollo/client';
// Types
import type { PageInfo, ProjectResponse } from '@/types';

export type ProjectsQueryData = {
  myProjects: {
    totalCount: number;
    nodes: ProjectResponse[];
    pageInfo: PageInfo;
  };
};

export type ProjectsQueryVariables = {
  first?: number;
  after?: string | null;
};

export type ProjectQueryData = {
  project: ProjectResponse;
};

export type ProjectQueryVariables = {
  request: {
    projectId: string;
  };
};

/** Запрос проекта по ID */
export const PROJECT_QUERY = gql`
  query Project($request: GetProjectByIdRequestInput!) {
    project(request: $request) {
      id
      name
      description
      fileUrl
      isPrivate
      createdAt
      updatedAt
    }
  }
`;

/** Запрос проектов пользователя */
export const PROJECTS_QUERY = gql`
  query MyProjects($first: Int, $after: String) {
    myProjects(first: $first, after: $after) {
      totalCount
      nodes {
        id
        name
        description
        fileUrl
        createdAt
        updatedAt
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
