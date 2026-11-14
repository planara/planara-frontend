// Apollo
import { useApolloClient } from '@apollo/client/react';
// Queries
import {
  CURRENT_CONSENT_VERSION_QUERY,
  type CurrentConsentVersionQueryData,
  type CurrentConsentVersionQueryVariables,
} from '@/graphql/privacy';

export const usePrivacy = () => {
  const client = useApolloClient();

  const getCurrentConsentVersionId = async (
    type: CurrentConsentVersionQueryVariables['type'],
  ): Promise<string> => {
    const response = await client.query<
      CurrentConsentVersionQueryData,
      CurrentConsentVersionQueryVariables
    >({
      query: CURRENT_CONSENT_VERSION_QUERY,
      variables: { type },
      fetchPolicy: 'network-only',
    });

    const versionId = response.data?.currentConsentVersion?.id;

    if (!versionId) {
      throw new Error('Нет действующей версии согласия на обработку персональных данных.');
    }

    return versionId;
  };

  return { getCurrentConsentVersionId };
};
