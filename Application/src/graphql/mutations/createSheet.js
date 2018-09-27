import { gql } from 'react-apollo';

import SheetCard from '../../components/SheetCard/SheetCard';

export default gql`
  mutation createSheet($text: String!) {
    createSheet(text: $text) {
      ...SheetCard
    }
  }
  ${SheetCard.fragments.sheet}
`;