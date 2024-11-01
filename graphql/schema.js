const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const CourseQueries = require("./queries/CourseQuery");

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...CourseQueries,
    //...UserQueries,
  },
});

// Root Mutation
const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    // ...CourseMutations,
    // ...UserMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  //mutation: RootMutation,
});
