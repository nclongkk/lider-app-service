import { gql } from 'graphql-request';

export const DEFAULT_USER_QUERY = gql`
  query {
    user {
      _id
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query userById($id: String!) {
    userById(id: $id) {
      email
      fullName
    }
  }
`;
