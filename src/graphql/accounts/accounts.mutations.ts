// Apollo
import { gql } from '@apollo/client';

// Types
import type { UpdateProfileRequest } from '@/types/api/requests/accounts/update-profile-request';
import type { ProfileResponse } from '@/types/api/responses/accounts/profile-response';

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
