import gql from 'graphql-tag';

const types = `
  type Template {
    _id: String!
    title: String
    mailData: JSON
  }
`;

const queries = `
  templateConversationDetail(conversationId: String!): [Template]
  templateAccounts: JSON
`;

const mutations = `
  templateAccountRemove(_id: String!): String
`;

const typeDefs = gql`
  scalar JSON
  scalar Date

  ${types}

  extend type Query {
    ${queries}
  }

  extend type Mutation {
    ${mutations}
  }
`;

export default typeDefs;
