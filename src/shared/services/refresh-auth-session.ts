// Core
import { print } from 'graphql';
// GraphQL
import { REFRESH_MUTATION, type RefreshMutationData } from '@/graphql/auth/auth.mutations.ts';
// Store
import { authStore } from '@/shared/store/auth-store';

type GraphQlResponse<TData> = {
  data?: TData;
  errors?: Array<{
    message: string;
    extensions?: {
      code?: string;
    };
  }>;
};

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;

if (!graphqlUrl) {
  throw new Error('VITE_GRAPHQL_URL is not defined');
}

export const refreshAuthSession = async () => {
  const refreshToken = authStore.refreshToken;

  if (!refreshToken) {
    throw new Error('Refresh token is missing');
  }

  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(REFRESH_MUTATION),
      variables: {
        request: {
          refreshToken,
        },
      },
    }),
  });

  const result = (await response.json()) as GraphQlResponse<RefreshMutationData>;

  if (!response.ok || result.errors?.length) {
    throw new Error(result.errors?.[0]?.message || 'Failed to refresh token');
  }

  if (!result.data?.refresh) {
    throw new Error('Refresh response is empty');
  }

  authStore.setSession({
    accessToken: result.data.refresh.accessToken,
    refreshToken: result.data.refresh.refreshToken,
    accessExpiresAtUtc: result.data.refresh.accessExpiresAtUtc,
    refreshExpiresAtUtc: result.data.refresh.refreshExpiresAtUtc,
  });

  return result.data.refresh;
};
