// Apollo
import { useMutation, useQuery } from '@apollo/client/react';
// Queries
import {
  PROFILE_QUERY,
  UPDATE_PROFILE_MUTATION,
  type ProfileQueryData,
  type UpdateProfileMutationData,
  type UpdateProfileMutationVariables,
} from '@/graphql/accounts';
// Types
import type { UpdateProfileRequest } from '@/types/api/requests/accounts/update-profile-request';

export const useAccount = () => {
  const { data, loading, error, refetch } = useQuery<ProfileQueryData>(PROFILE_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const [updateProfileMutation, { loading: updateProfileLoading, error: updateProfileError }] =
    useMutation<UpdateProfileMutationData, UpdateProfileMutationVariables>(UPDATE_PROFILE_MUTATION);

  const updateProfile = async (request: UpdateProfileRequest) => {
    const result = await updateProfileMutation({
      variables: {
        request,
      },
      update: (cache, { data: mutationData }) => {
        if (!mutationData?.updateProfile) {
          return;
        }

        cache.writeQuery<ProfileQueryData>({
          query: PROFILE_QUERY,
          data: {
            profile: mutationData.updateProfile,
          },
        });
      },
    });

    return result.data?.updateProfile;
  };

  return {
    profile: data?.profile,
    loading,
    error,
    refetchProfile: refetch,

    updateProfile,
    updateProfileLoading,
    updateProfileError,
  };
};
