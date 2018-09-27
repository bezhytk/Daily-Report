import { gql } from 'react-apollo';

export default gql`
  mutation signup(
    $fullName: String!
    $email: String!
    $password: String!
    $compayName: String!
    $avatar: String
  ) {
    signup(
      fullName: $fullName
      email: $email
      password: $password
      compayName: $compayName
      avatar: $avatar
    ) {
      token
    }
  }
`;