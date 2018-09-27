import React, { Component } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { connectActionSheet } from '@expo/react-native-action-sheet';

import { logout } from '../actions/user';

import Loading from './Loading';
import ButtonHeader from './ButtonHeader';

const ICON_SIZE = 20;

const ButtonHeader = styled(Touchable).attrs({
  feedback: 'opacity',
})`
  flex: 1;
  flexDirection: row;
  alignItems: center;
  justifyContent: flex-end;
  paddingHorizontal: 32px;
`;

class HeaderLogout extends Component {
  _onOpenActionSheet = () => {
    const options = ['Logout', 'Cancel'];
    const destructiveButtonIndex = 0;
    this.props.showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          this.props.client.resetStore()
          return this.props.logout();
        }
      },
    );
  };

  render() {
    if (!this.props.info) {
      return (
        <ButtonHeader side="right" disabled>
          <Loading size="small" />
        </ButtonHeader>
      );
    }
    return (
      <ButtonHeader side="right" onPress={this._onOpenActionSheet}>
        <MaterialCommunityIcons
          name="logout"
          color={colors.WHITE}
          size={ICON_SIZE}
        />
      </ButtonHeader>
    );
  }
}

export default withApollo(connect(state => ({ info: state.user.info }), { logout })(
  connectActionSheet(HeaderLogout),
));