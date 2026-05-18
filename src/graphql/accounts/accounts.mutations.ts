// Apollo
import { gql } from '@apollo/client';
// Types
import type { UpdateProfileRequest, ProfileResponse } from '@/types';

export type UpdateProfileMutationData = {
  updateProfile: ProfileResponse;
};

export type UpdateProfileMutationVariables = {
  request: UpdateProfileRequest;
};

/** Обновление профиля пользователя */
export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($request: UpdateProfileRequestInput!) {
    updateProfile(request: $request) {
      username
      displayName
      name
      surname
      avatarUrl
      bio
    }
  }
`;
