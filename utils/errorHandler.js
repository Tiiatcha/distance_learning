//const { GraphQLError } = require("graphql");

const errorHandler = (error) => {
  console.error(error.message.red);
  const error_details = {
    message: error.message,
    locations: error.locations,
    path: error.path,
  };
  // if in development mode, show the stack trace
  if (process.env.LEARNING_NODE_ENV === "development")
    error_details.stack = error.stack;
  return error_details;
};

module.exports = errorHandler;
