const { GraphQLString, GraphQLNonNull, GraphQLInt } = require("graphql");

const ResponseType = require("../types/ResponseType");
const {
  userRegistration,
  loginUser,
  deleteUser,
} = require("../../dao/services/userServices");

const UserMutations = {
  registerUser: {
    type: ResponseType,
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      repeatPassword: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
      return userRegistration(args);
    },
  },
  loginUser: {
    type: ResponseType,
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
      return loginUser(args);
    },
  },
  deleteUser: {
    type: ResponseType,
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
      return deleteUser(args.username, context);
    },
  },
};

module.exports = UserMutations;
