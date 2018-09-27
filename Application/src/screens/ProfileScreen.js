import React, { Component } from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { FlatList } from 'react-native';

import ProfileHeader from '../components/ProfileHeader';
import SheetCard from '../components/SheetCard/SheetCard';

import GET_USER_SHEETS_QUERY from '../graphql/queries/getUserSheets';

const Root = styled.View`
  flex: 1;
  backgroundColor: #FFFFFF;
`;

const T = styled.Text``

class ProfileScreen extends Component {
  state = {  }

  _renderItem = ({ item }) => <SheetCard {...item} />;

  _renderPlaceholder = () => (
    <SheetCard
      placeholder
      isLoaded={this.props.data.loading}
    />
  )

  render() {
    const { info, data } = this.props;

    return (
      <Root>
        <ProfileHeader {...info} />
        {data.loading ? (
          <FlatList
            data={[1, 2, 3]}
            renderItem={this._renderPlaceholder}
            keyExtractor={item => item}
            contentContainerStyle={{ alignSelf: 'stretch' }}
          />
        ) : (
          <FlatList
            data={data.getUserSheets}
            renderItem={this._renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={{ alignSelf: 'stretch' }}
          />
        )}
      </Root>
    );
  }
}

export default compose(
  graphql(GET_USER_SHEETS_QUERY),
  connect(state => ({ info: state.user.info }),
))(ProfileScreen);