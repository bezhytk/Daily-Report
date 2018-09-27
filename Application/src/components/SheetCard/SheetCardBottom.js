import React from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Touchable from '@appandflow/touchable';

import { colors } from '../../utils/constants';

const ICON_SIZE = 20;

const Root = styled.View`
  height: 40;
  flexDirection: row;
`;

const Button = styled(Touchable).attrs({
  feedback: 'opacity',
})`
  flex: 1;
  flexDirection: row;
  alignItems: center;
  justifyContent: flex-end;
  paddingHorizontal: 32px;
`;

function SheetCardBottom({ onApprovePress, isApproved }) {
  return (
    <Root>
      <Button onPress={onApprovePress}>
        <MaterialCommunityIcons
          name="clipboard-check"
          color={isApproved ? colors.SECONDARY : colors.LIGHT_GRAY}
          size={ICON_SIZE}
        />
      </Button>
    </Root>
  );
}

export default SheetCardBottom;