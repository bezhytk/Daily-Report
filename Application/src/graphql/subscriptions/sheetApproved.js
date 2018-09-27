import { gql } from 'react-apollo';

export default gql`
  subscription {
    sheetApproved {
      _id
    }
  }
`;