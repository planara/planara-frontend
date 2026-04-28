// Core
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Observable } from '@apollo/client';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
import { ErrorLink } from '@apollo/client/link/error';
import { SetContextLink } from '@apollo/client/link/context';
// Store
import { authStore } from '@/shared/store/auth-store';
// Services
import { refreshAuthSession } from '@/shared/services/refresh-auth-session';

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;

if (!graphqlUrl) {
  throw new Error('VITE_GRAPHQL_URL is not defined');
}

const TOKEN_EXPIRE_SKEW_MS = 30_000;

let refreshPromise: ReturnType<typeof refreshAuthSession> | null = null;

const getRefreshPromise = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAuthSession().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const isExpired = (expiresAtUtc: string | null, skewMs = TOKEN_EXPIRE_SKEW_MS) => {
  if (!expiresAtUtc) {
    return true;
  }

  return new Date(expiresAtUtc).getTime() <= Date.now() + skewMs;
};

const logoutAfterRefreshFail = () => {
  authStore.logout();

  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const ensureValidAccessToken = async () => {
  const accessToken = authStore.accessToken;

  if (!accessToken) {
    return null;
  }

  const accessTokenExpired = isExpired(authStore.accessExpiresAtUtc);

  if (!accessTokenExpired) {
    return accessToken;
  }

  const refreshToken = authStore.refreshToken;
  const refreshTokenExpired = isExpired(authStore.refreshExpiresAtUtc, 0);

  if (!refreshToken || refreshTokenExpired) {
    logoutAfterRefreshFail();
    throw new Error('Refresh token is expired');
  }

  const tokens = await getRefreshPromise();

  return tokens.accessToken;
};

const isAuthError = (error: unknown) => {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.some((graphQLError) => {
      const code = graphQLError.extensions?.code;
      const message = graphQLError.message.toLowerCase();

      return (
        code === 'UNAUTHENTICATED' ||
        code === 'AUTH_NOT_AUTHENTICATED' ||
        code === 'AUTH_NOT_AUTHORIZED' ||
        message.includes('unauthorized') ||
        message.includes('authenticated') ||
        message.includes('expired') ||
        message.includes('token')
      );
    });
  }

  if (ServerError.is(error)) {
    return error.statusCode === 401;
  }

  return false;
};

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (!isAuthError(error)) {
    return;
  }

  return new Observable((observer) => {
    let subscription: { unsubscribe: () => void } | undefined;

    getRefreshPromise()
      .then((tokens) => {
        const oldHeaders = operation.getContext().headers ?? {};

        operation.setContext({
          headers: {
            ...oldHeaders,
            Authorization: `Bearer ${tokens.accessToken}`,
            'GraphQL-Preflight': '1',
          },
        });

        subscription = forward(operation).subscribe({
          next: (value) => observer.next(value),
          error: (retryError) => observer.error(retryError),
          complete: () => observer.complete(),
        });
      })
      .catch((refreshError) => {
        logoutAfterRefreshFail();
        observer.error(refreshError);
      });

    return () => {
      subscription?.unsubscribe();
    };
  });
});

const authLink = new SetContextLink(async (prevContext) => {
  const token = await ensureValidAccessToken();

  return {
    headers: {
      ...prevContext.headers,
      'GraphQL-Preflight': '1',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const httpLink = new HttpLink({
  uri: graphqlUrl,
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
