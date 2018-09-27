import React, { Component } from 'react';
import styled from 'styled-components/native';
import { Platform, Keyboard } from 'react-native';
import Touchable from '@appandflow/touchable';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { colors } from '../utils/constants';
import CREATE_SHEET_MUTATION from '../graphql/mutations/createSheet';
import GET_SHEETS_QUERY from '../graphql/queries/getSheets';

const Root = styled.View`
  backgroundColor: ${props => props.theme.WHITE};
  flex: 1;
  alignItems: center;
`;

const Wrapper = styled.View`
  height: 80%;
  width: 90%;
  paddingTop: 5;
  position: relative;
`;

const Input = styled.TextInput.attrs({
  multiline: true,
  placeholder: "กรอกรายละเอียดงานที่ได้รับมอบหมาย",
  maxLength: 140,
  selectionColor: Platform.OS === 'android' && colors.PRIMARY,
  autoFocus: true,
})`
  height: 40%;
  width: 100%;
  fontSize: 18;
  color: ${props => props.theme.SECONDARY};
`;

const SaveButton = styled(Touchable).attrs({
  feedback: 'opacity',
  hitSlop: { top: 20, left: 20, right: 20, bottom: 20 },
})`
  backgroundColor: ${props => props.theme.SECONDARY};
  justifyContent: center;
  alignItems: center;
  width: 80;
  height: 40;
  borderRadius: 20;
  position: absolute;
  top: 60%;
  right: 0;
`;

const SaveButtonText = styled.Text`
  color: ${props => props.theme.WHITE};
  fontSize: 16;
`;

const TextLength = styled.Text`
  fontSize: 18;
  color: ${props => props.theme.PRIMARY};
  position: absolute;
  top: 45%;
  right: 5%;
`;

class NewSheetScreen extends Component {
  state = {
    text: '',
  };

  _onChangeText = text => this.setState({ text });

  _onCreateSheetPress = async () => {
    const { user } = this.props;

    await this.props.mutate({
      variables: {
        text: this.state.text
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createSheet: {
          __typename: 'Sheet',
          text: this.state.text,
          _id: Math.round(Math.random() * -1000000),
          createdAt: new Date(),
          isApproved: false,
          user: {
            __typename: 'User',
            firstName: user.firstName,
            lastName: user.lastName,
            companyName: user.companyName,
            avatar: user.avatar
          }
        },
      },
      update: (store, { data: { createSheet } }) => {
        const data = store.readQuery({ query: GET_SHEETS_QUERY });
        if (!data.getSheets.find(t => t._id === createSheet._id)) {
          store.writeQuery({ query: GET_SHEETS_QUERY, data: { getSheets: [{ ...createSheet }, ...data.getSheets] } });
        }
      }
    });

    Keyboard.dismiss();
    this.props.navigation.goBack(null);
  }

  get _textLength() {
    return 140 - this.state.text.length;
  }

  get _buttonDisabled() {
    return this.state.text.length < 5;
  }

  render() {
    return (
      <Root>
        <Wrapper>
          <Input value={this.state.text} onChangeText={this._onChangeText} />
          <TextLength>
            {this._textLength}
          </TextLength>
          <SaveButton onPress={this._onCreateSheetPress} disabled={this._buttonDisabled}>
            <SaveButtonText>บันทึก</SaveButtonText>
          </SaveButton>
        </Wrapper>
      </Root>
    );
  }
}

export default compose(
  graphql(CREATE_SHEET_MUTATION),
  connect(state => ({ user: state.user.info }))
)(NewSheetScreen);