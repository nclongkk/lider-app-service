import { gql } from 'graphql-request';

export const DEFAULT_USER_QUERY = gql`
  query {
    user {
      _id
    }
  }
`;
