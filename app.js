// packages
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const color = require("colors");
require("dotenv").config();

// schema
const schema = require("./graphql/schema");

// imports
const errorHandler = require("./utils/errorHandler");
const authenticate = require("./middleware/authenticate");
const e = require("cors");
const app = express();
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
      querEditor: process.env.NODE_ENV === "development",
      headerEditorEnabled: process.env.NODE_ENV === "development",
    },
    customFormatErrorFn: errorHandler,
  }))
);

module.exports = app;
