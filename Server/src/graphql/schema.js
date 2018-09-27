export default `
  scalar Date

  type Status {
    message: String!
  }

  type Auth {
    token: String!
  }

  type User {
    _id: ID!
    email: String!
    firstName: String
    lastName: String
    companyName: String
    avatar: String
    createdAt: Date!
    updatedAt: Date!
  }

  type Me {
    _id: ID!
    email: String!
    firstName: String
    lastName: String
    companyName: String
    avatar: String
    createdAt: Date!
    updatedAt: Date!
  }

  type Sheet {
    _id: ID!
    text: String!
    mentorApproved: Int!
    isApproved: Boolean
    createdAt: Date!
    updatedAt: Date!
    user: User!
  }

  type Query {
    getSheet(_id: ID!): Sheet
    getSheets: [Sheet]
    getUserSheets: [Sheet]
    me: Me
  }

  type Mutation {
    createSheet(text: String!): Sheet
    updateSheet(_id: ID!, text: String): Sheet
    deleteSheet(_id: ID!): Status
    approvedSheet(_id: ID!): Sheet
    signup(email: String!, fullName: String!, password: String!, avatar: String, companyName: String): Auth
    login(email: String!, password: String!): Auth
  }

  type Subscription {
    sheetAdded: Sheet
    sheetApproved: Sheet
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;