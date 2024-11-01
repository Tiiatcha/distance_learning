const { GraphQLError } = require("graphql");
const checkAuth = require("./checkAuth");

const checkRole = (context, roles) => {
  const { role } = context;
  console.log("Role: ", role);
  const user = checkAuth(context);

  if (!roles.includes(user.role)) {
    throw new GraphQLError("Not authorized.");
  }
  return user;
};

module.exports = checkRole;
