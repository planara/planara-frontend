// Apollo
import { gql } from '@apollo/client';
import type {
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  DeleteProjectResponse,
  DeleteProjectRequest,
} from '@/types';

export type CreateProjectMutationData = {
  createProject: ProjectResponse;
};

export type CreateProjectMutationVariables = {
  request: CreateProjectRequest;
};

export type UpdateProjectMutationData = {
  updateProject: ProjectResponse;
};

export type UpdateProjectMutationVariables = {
  request: UpdateProjectRequest;
};

export type DeleteProjectMutationData = {
  deleteProject: DeleteProjectResponse;
};

export type DeleteProjectMutationVariables = {
  request: DeleteProjectRequest;
};

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($request: UpdateProjectRequestInput!) {
    updateProject(request: $request) {
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

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($request: DeleteProjectRequestInput!) {
    deleteProject(request: $request) {
      success
    }
  }
`;

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($request: CreateProjectRequestInput!) {
    createProject(request: $request) {
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
