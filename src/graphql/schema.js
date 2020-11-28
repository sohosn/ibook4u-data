// https://www.apollographql.com/blog/three-ways-to-represent-your-graphql-schema-a41f4175100d/

// const resolvers = require('./resolvers');
// const typeDefs = require('./typeDefs');

// module.exports = {
//   typeDefs,
//   resolvers,
// };

import { GraphQLSchema as Schema } from 'graphql';
import queries from './queries';
import mutations from './mutations';

const schema = new Schema({
  query: queries,
  mutation: mutations,
});

module.exports = schema;
