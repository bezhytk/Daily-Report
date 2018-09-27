import React from 'react';
import styled from 'styled-components/native';
import { graphql, gql } from 'react-apollo';
import Placeholder from 'rn-placeholder';

import SheetCardHeader from './SheetCardHeader';
import SheetCardBottom from './SheetCardBottom';
import APPROVE_SHEET_MUTATION from '../../graphql/mutations/approveSheet';

const Root = styled.View`
  minHeight: 180;
  backgroundColor: ${props => props.theme.WHITE};
  width: 100%;
  padding: 7px;
  shadowColor: ${props => props.theme.SECONDARY};
  shadowOffset: 0px 2px;
  shadowRadius: 2;
  shadowOpacity: 0.1;
  marginVertical: 5;
`;

const CardContentContainer = styled.View`
  flex: 1;
  padding: 10px 20px 10px 0px;
`;

const CardContentText = styled.Text`
  fontSize: 14;
  textAlign: left;
  fontWeight: 500;
  color: ${props => props.theme.SECONDARY};
`;

const Wrapper = styled.View`flex: 1`;

function SheetCard({
  text,
  user,
  createdAt,
  approve,
  isApproved,
  placeholder,
  isLoaded
}) {
  if (placeholder) {
    return (
      <Root>
        <Placeholder.ImageContent
          onReady={!isLoaded}
          lineNumber={2}
          animate="shine"
          lastLineWidth="40%"
        >
          <Wrapper />
        </Placeholder.ImageContent>
      </Root>
    )
  }

  return (
    <Root>
      <SheetCardHeader {...user} createdAt={createdAt} />
      <CardContentContainer>
        <CardContentText>
          {text}
        </CardContentText>
      </CardContentContainer>
      <SheetCardBottom
        isApproved={isApproved}
        onApprovePress={approve}
      />
    </Root>
  );
}

SheetCard.fragments = {
  sheet: gql`
    fragment SheetCard on Sheet {
      text
      _id
      createdAt
      isApproved
      approveCount
      user {
        avatar
        lastName
        firstName
        companyName
      }
    }
  `
}

export default graphql(APPROVE_SHEET_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    approve: () =>
      mutate({
        variables: { _id: ownProps._id },
        optimisticResponse: {
          __typename: 'Mutation',
          approveSheet: {
            __typename: 'Sheet',
            _id: ownProps._id,
            approveCount: ownProps.isApproved
              ? ownProps.approveCount - 1
              : ownProps.approveCount + 1,
            isApproved: !ownProps.isApproved,
          },
        },
      }),
  }),
})(SheetCard);