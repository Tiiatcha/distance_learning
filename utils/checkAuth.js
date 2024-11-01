const { GraphQLError } = require("graphql");

const checkAuth = (context) => {
  //console.log(context);
  if (!context.user) {
    throw new GraphQLError("User not authenticated");
  }
  return context.user;
};

module.exports = checkAuth;
