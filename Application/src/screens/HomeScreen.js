import React, { Component } from 'react';
import styled from 'styled-components/native';
import { graphql, compose, withApollo } from 'react-apollo';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';

import SheetCard from '../components/SheetCard/SheetCard';

import { getUserInfo } from '../actions/user';

import GET_SHEETS_QUERY from '../graphql/queries/getSheets';
import ME_QUERY from '../graphql/queries/me';
import SHEET_ADDED_SUBSCRIPTION from '../graphql/subscriptions/sheetAdded';
import SHEET_APPROVED_SUBSCRIPTION from '../graphql/subscriptions/sheetApproved';

const ICON_SIZE = 20;

const Root = styled.View`
  flex: 1;
  paddingTop: 5;
`;

const CreateButton = styled(Touchable).attrs({
  feedback: 'opacity',
  hitSlop: { top: 20, left: 20, right: 20, bottom: 20 },
})`
  backgroundColor: ${props => props.theme.SECONDARY};
  justifyContent: center;
  alignItems: center;
  width: 60,  
  height: 60,   
  borderRadius: 30,                                                
  position: 'absolute',                                          
  bottom: 10,                                                    
  right: 10, 
`;

class HomeScreen extends Component {
  componentWillMount() {
    this.props.data.subscribeToMore({
      document: SHEET_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newSheet = subscriptionData.data.sheetAdded;

        if (!prev.getSheets.find(t => t._id === newSheet._id)) {
          return {
            ...prev,
            getSheets: [{ ...newSheet }, ...prev.getSheets],
          };
        }

        return prev;
      },
    });

    this.props.data.subscribeToMore({
      document: SHEET_APPROVED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newSheet = subscriptionData.datasheetApproved;
        return {
          ...prev,
          getSheets: prev.getSheets.map(
            sheet =>
              sheet._id === newSheet._id
                ? {
                    ...sheet,
                    approveCount: newSheet.approveCount,
                  }
                : sheet,
          ),
        };
      },
    });
  }

  componentDidMount() {
    this._getUserInfo();
  }

  _getUserInfo = async () => {
    const { data: { me } } = await this.props.client.query({ query: ME_QUERY });
    this.props.getUserInfo(me);
  };

  _renderItem = ({ item }) => <SheetCard {...item} />;

  _renderPlaceholder = () => <SheetCard placeholder isLoaded={this.props.data.loading} />

  render() {
    const { data } = this.props;
    if (data.loading) {
      return (
        <Root>
          <FlatList
            contentContainerStyle={{ alignSelf: 'stretch' }}
            data={[1, 2, 3]}
            renderItem={this._renderPlaceholder}
            keyExtractor={item => item}
          />
          <CreateButton onPress={() => navigation.navigate('NewSheet')}>
            <FontAwesome 
            name="pencil"
            color={colors.WHITE}
            size={ICON_SIZE}
            />
          </CreateButton>
        </Root>
      );
    }
    return (
      <Root>
        <FlatList
          contentContainerStyle={{ alignSelf: 'stretch' }}
          data={data.getSheets}
          keyExtractor={item => item._id}
          renderItem={this._renderItem}
        />
        <CreateButton onPress={() => navigation.navigate('NewSheet')}>
            <FontAwesome 
            name="pencil"
            color={colors.WHITE}
            size={ICON_SIZE}
            />
        </CreateButton>
      </Root>
    );
  }
}

export default withApollo(
  compose(connect(undefined, { getUserInfo }), graphql(GET_SHEETS_QUERY))(
    HomeScreen,
  ),
);