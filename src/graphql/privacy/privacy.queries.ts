// Apollo
import { gql } from '@apollo/client';

export type CurrentConsentVersionQueryData = {
  currentConsentVersion: {
    id: string;
  } | null;
};

export type CurrentConsentVersionQueryVariables = {
  type: 'PERSONAL_DATA';
};

/** Получение действующей версии согласия по типу */
export const CURRENT_CONSENT_VERSION_QUERY = gql`
  query CurrentConsentVersion($type: ConsentType!) {
    currentConsentVersion(type: $type) {
      id
    }
  }
`;
