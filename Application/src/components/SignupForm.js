import React, { Component } from 'react';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import Touchable from '@appandflow/touchable';
import { Platform, Keyboard, AsyncStorage } from 'react-native';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { colors, fakeAvatar } from '../utils/constants';
import SIGNUP_MUTATION from '../graphql/mutations/signup';
import Loading from '../components/Loading';
import { login } from '../actions/user';

const Root = styled(Touchable).attrs({
  feedback: 'none',
})`
  flex: 1;
  position: relative;
  justifyContent: center;
  alignItems: center;
`;

const Wrapper = styled.View`
  alignSelf: stretch;
  alignItems: center;
  justifyContent: center;
  flex: 1;
`;

const BackButton = styled(Touchable).attrs({
  feedback: 'opacity',
  hitSlop: { top: 20, bottom: 20, right: 20, left: 20 },
})`
  justifyContent: center;
  alignItems: center;
  position: absolute;
  top: 5%;
  zIndex: 1;
  left: 5%;
`;

const ButtonConfirm = styled(Touchable).attrs({
  feedback: 'opacity',
})`
  position: absolute;
  bottom: 15%;
  width: 70%;
  height: 50;
  backgroundColor: ${props => props.theme.SECONDARY};
  borderRadius: 10;
  justifyContent: center;
  alignItems: center;
  shadowColor: #000;
  shadowOpacity: 0.2;
  shadowRadius: 5;
  shadowOffset: 0px 2px;
  elevation: 2;
`;

const ButtonConfirmText = styled.Text`
  color: ${props => props.theme.WHITE};
  fontWeight: 600;
`;

const InputWrapper = styled.View`
  height: 50;
  width: 70%;
  borderBottomWidth: 2;
  borderBottomColor: ${props => props.theme.SECONDARY};
  marginVertical: 5;
  justifyContent: flex-end;
`;

const Input = styled.TextInput.attrs({
  placeholderTextColor: colors.SECONDARY,
  selectionColor: Platform.OS === 'android' ? colors.PRIMARY : undefined,
  autoCorrect: false,
})`
  height: 30;
  color: ${props => props.theme.WHITE};
`;

class SignupForm extends Component {
  state = {
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    loading: false,
  };

  _onOutsidePress = () => Keyboard.dismiss();

  _onChangeText = (text, type) => this.setState({ [type]: text });

  _checkIfDisabled() {
    const { fullName, email, password, companyName } = this.state;

    if (!fullName || !email || !password || !companyName) {
      return true;
    }

    return false;
  }

  _onSignupPress = async () => {
    this.setState({ loading: true });

    const { fullName, email, password, companyName } = this.state;
    const avatar = fakeAvatar;

    try {
      const { data } = await this.props.mutate({
        variables: {
          fullName,
          email,
          password,
          companyName,
          avatar,
        },
      });
      await AsyncStorage.setItem('@dailyreportapp', data.signup.token);
      this.setState({ loading: false });
      return this.props.login();
    } catch (error) {
      throw error;
    }
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Root onPress={this._onOutsidePress}>
        <BackButton onPress={this.props.onBackPress}>
          <Ionicons color={colors.SECONDARY} size={30} name="md-arrow-round-back" />
        </BackButton>
        <Wrapper>
          <InputWrapper>
            <Input
              placeholder="ชื่อ-สกุล"
              autoCapitalize="words"
              onChangeText={text => this._onChangeText(text, 'fullName')}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              placeholder="อีเมล์"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={text => this._onChangeText(text, 'email')}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              placeholder="รหัสผ่าน"
              secureTextEntry
              onChangeText={text => this._onChangeText(text, 'password')}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              placeholder="ชื่อบริษัท"
              autoCapitalize="none"
              onChangeText={text => this._onChangeText(text, 'companyName')}
            />
          </InputWrapper>
        </Wrapper>
        <ButtonConfirm
          onPress={this._onSignupPress}
          disabled={this._checkIfDisabled()}
        >
          <ButtonConfirmText>Register</ButtonConfirmText>
        </ButtonConfirm>
      </Root>
    );
  }
}

export default compose(graphql(SIGNUP_MUTATION), connect(undefined, { login }))(
  SignupForm,
);