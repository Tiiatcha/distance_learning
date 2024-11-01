const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
} = require("graphql");

const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    collectionId: { type: GraphQLString },
    collectionName: { type: GraphQLString },
    instructor: { type: GraphQLString },
    //price: { type: GraphQLFloat },
    duration: { type: GraphQLInt },
    outcome: { type: GraphQLString },
    created: { type: GraphQLString },
    updated: { type: GraphQLString },
  }),
});

module.exports = CourseType;
