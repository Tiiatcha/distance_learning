// packages
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const color = require("colors");
require("dotenv").config();

// imports

const app = express();
//middleware

//auth middleware

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
  }))
);

module.exports = app;
