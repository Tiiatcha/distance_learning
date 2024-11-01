const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const CourseQueries = require("./queries/CourseQuery");
const CollectionQueries = require("./queries/CollectionQuery");

// import mutations
const CourseMutations = require("./mutations/CourseMutations");

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...CourseQueries,
    ...CollectionQueries,
    //...UserQueries,
  },
});

// Root Mutation
const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...CourseMutations,
    // ...UserMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
