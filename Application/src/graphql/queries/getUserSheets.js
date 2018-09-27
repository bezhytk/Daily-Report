import { gql } from 'react-apollo';

import SheetCard from '../../components/SheetCard/SheetCard';

export default gql`
  {
    getUserSheets {
      ...SheetCard
    }
  }
  ${SheetCard.fragments.sheet}
`;