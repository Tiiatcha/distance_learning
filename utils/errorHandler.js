//const { GraphQLError } = require("graphql");

// const errorHandler = (error) => {
//   console.error(error.message.red);
//   const error_details = {
//     message: error.message,
//     locations: error.locations,
//     path: error.path,
//   };
//   // if in development mode, show the stack trace
//   if (process.env.LEARNING_NODE_ENV === "development")
//     error_details.stack = error.stack;
//   return error_details;
// };

// module.exports = errorHandler;

const { GraphQLError } = require("graphql");

const errorHandler = (error) => {
  console.error(error.message.red);
  const error_details = {
    message: error.message,
    locations: error.locations,
    path: error.path,
  };

  // Determine the appropriate status code
  let statusCode;
  if (error.message.includes("token")) {
    statusCode = 401; // Unauthorized for token errors
  } else if (error instanceof GraphQLError) {
    statusCode =
      error.extensions?.code === "UNAUTHENTICATED"
        ? 401
        : error.extensions?.code === "FORBIDDEN"
        ? 403
        : 400; // Default to 400 for bad requests
  } else {
    statusCode = 500; // Internal Server Error
  }

  // Include the status code in the response
  return {
    statusCode,
    error: error_details,
  };
};

module.exports = errorHandler;
