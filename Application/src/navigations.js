import React, { Component } from 'react';
import {
  addNavigationHelpers,
  StackNavigator,
  TabNavigator,
} from 'react-navigation';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesome, EvilIcons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';
import NewSheetScreen from './screens/NewSheetScreen';

import HeaderLogout from './components/HeaderLogout';
import ButtonHeader from './components/ButtonHeader';

import { colors, fakeAvatar } from './utils/constants';

const TAB_ICON_SIZE = 20;

const Tabs = TabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        headerTitle: 'Home',
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome size={TAB_ICON_SIZE} color={tintColor} name="home" />,
      }),
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: () => ({
        headerTitle: 'Profile',
        tabBarIcon: ({ tintColor }) =>
          <FontAwesome size={TAB_ICON_SIZE} color={tintColor} name="user-circle" />,
      }),
    },
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      activeTintColor: colors.PRIMARY,
      inactiveTintColor: colors.LIGHT_GRAY,
      style: {
        backgroundColor: colors.WHITE,
        height: 50,
        paddingVertical: 5,
      },
    },
  },
);

const NewSheetModal = StackNavigator(
  {
    NewSheet: {
      screen: NewSheetScreen,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <Avatar source={{ uri: avatar || fakeAvatar }} />,
        headerRight: (
          <ButtonHeader
            side="right"
            onPress={() => {
              Keyboard.dismiss();
              navigation.goBack(null);
            }}
          >
            <EvilIcons color={colors.WHITE} size={25} name="close" />
          </ButtonHeader>
        ),
      }),
    },
  },
  {
    headerMode: 'none',
  },
);

const AppMainNav = StackNavigator(
  {
    Home: {
      screen: Tabs,
      navigationOptions: ({ navigation }) => ({
        headerLeft: <Avatar source={{ uri: avatar || fakeAvatar }} />,
        headerRight: <HeaderLogout />
      }),
    },
    NewSheet: {
      screen: NewSheetModal,
    },
  },
  {
    cardStyle: {
      backgroundColor: '#F1F6FA',
    },
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: colors.WHITE,
      },
      headerTitleStyle: {
        fontweight: 'bold',
        color: colors.SECONDARY,
      },
    }),
  },
);

class AppNavigator extends Component {
  render() {
    const nav = addNavigationHelpers({
      dispatch: this.props.dispatch,
      state: this.props.nav,
    });
    if (!this.props.user.isAuthenticated) {
      return <AuthenticationScreen />;
    }
    return <AppMainNav navigation={nav} />;
  }
}

export default connect(state => ({
  nav: state.nav,
  user: state.user,
}))(AppNavigator);

export const router = AppMainNav.router;