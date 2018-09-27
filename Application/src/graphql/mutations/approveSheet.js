import { gql } from 'react-apollo';

export default gql`
  mutation approveSheet($_id: ID!) {
    approveSheet(_id: $_id) {
      isApproved
      _id
    }
  }
`;