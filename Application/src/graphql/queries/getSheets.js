import { gql } from 'react-apollo';

import SheetCard from '../../components/SheetCard/SheetCard';

export default gql`
  {
    getSheets {
      ...SheetCard
    }
  }
  ${SheetCard.fragments.sheet}
`;