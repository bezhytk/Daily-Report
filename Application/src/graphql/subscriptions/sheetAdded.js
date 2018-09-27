import { gql } from 'react-apollo';

import SheetCard from '../../components/SheetCard/SheetCard';

export default gql`
  subscription {
    sheetAdded {
      ...SheetCard
    }
  }
  ${SheetCard.fragments.sheet}
`;