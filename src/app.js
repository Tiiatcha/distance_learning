// packages
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const color = require("colors");

require("dotenv").config({
  path: process.env.LEARNING_NODE_ENV.trim() === "test" ? ".env.test" : ".env",
});

console.log("Environment: ", process.env.LEARNING_NODE_ENV);
console.log("Database name: ", process.env.DB_NAME);
// schema
const schema = require("./graphql/schema");

// imports
const errorHandler = require("./utils/errorHandler");
const authenticate = require("./middleware/authenticate");
const e = require("cors");
const app = express();
app.use(express.json());
//middleware

//auth middleware
app.use(authenticate);

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    context: req,
    graphiql: {
      querEditor: process.env.LEARNING_NODE_ENV === "development",
      headerEditorEnabled: process.env.LEARNING_NODE_ENV === "development",
    },
    customFormatErrorFn: errorHandler,
  }))
);

module.exports = app;
