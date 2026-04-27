// Apollo
import { gql } from '@apollo/client';
// Types
import type { ProfileResponse } from '@/types/api/responses/accounts/profile-response';

export type ProfileQueryData = {
  profile: ProfileResponse;
};

/** Запрос профиля пользователя */
export const PROFILE_QUERY = gql`
  query Profile {
    profile {
      username
      displayName
      name
      surname
      avatarUrl
      bio
    }
  }
`;
