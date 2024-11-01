const { GraphQLString, GraphQLNonNull, GraphQLInt } = require("graphql");

const ResponseType = require("../types/ResponseType");
const {
  userRegistration,
  loginUser,
} = require("../../dao/repositories/userRepository");

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
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
      return loginUser(args);
    },
  },
};

module.exports = UserMutations;
