import GraphQLDate from 'graphql-date';

import SheetResolvers from './sheet-resolvers';
import UserResolvers from './user-resolvers';
import User from '../../models/User';

export default {
  Date: GraphQLDate,
  Sheet: {
    user: ({ user }) => User.findById(user),
  },
  Query: {
    getSheet: SheetResolvers.getSheet,
    getSheets: SheetResolvers.getSheets,
    getUserSheets: SheetResolvers.getUserSheets,
    me: UserResolvers.me
  },
  Mutation: {
    createSheet: SheetResolvers.createSheet,
    updateSheet: SheetResolvers.updateSheet,
    deleteSheet: SheetResolvers.deleteSheet,
    approveSheet: SheetResolvers.approveSheet,
    signup: UserResolvers.signup,
    login: UserResolvers.login
  },
  Subscription: {
    sheetAdded: SheetResolvers.sheetAdded,
    sheetApproved: SheetResolvers.sheetApproved
  }
};