import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} from 'graphql';
import { AccountMutations } from '../mutations';
import { AccountQueries } from '../queries';

// ============================================================================= types

const AccountType = new GraphQLObjectType({
  name: 'account',
  fields: function () {
    return {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      bank_name: { type: GraphQLString },
      account_number: { type: GraphQLInt },
      is_verified: { type: GraphQLBoolean },
    };
  },
});

// ============================================================================= query

const Query = new GraphQLObjectType({
  name: 'query',
  fields: {
    user: {
      type: new GraphQLList(AccountType),
      resolve: function () {
        return AccountQueries.retrieveUsers();
      },
    },
  },
});

// ============================================================================= mutations

const Mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    create: {
      type: AccountType,
      args: {
        name: { type: GraphQLString },
        bank_name: { type: GraphQLString },
        account_number: { type: GraphQLString },
      },
      resolve(parent, args) {
        return AccountMutations.createAccount(parent, args);
      },
    },

    retrieve: {
      type: AccountType,
      args: {
        account_number: { type: GraphQLString },
        bank_code: { type: GraphQLString },
      },
      resolve(parent, args) {
        return AccountMutations.retrieveAccount(parent, args);
      },
    },
  },
});

// ============================================================================= exports

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
