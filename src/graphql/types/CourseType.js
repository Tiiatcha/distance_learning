const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
} = require("graphql");

const CollectionType = require("./CollectionType");
const {
  getCollectionById,
} = require("../../dao/repositories/collectionsRepository");

const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    collection: {
      type: CollectionType,
      fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        return getCollectionById(parent.collection);
      },
    },
    instructor: { type: GraphQLString },
    //price: { type: GraphQLFloat },
    duration: { type: GraphQLInt },
    outcome: { type: GraphQLString },
    created: { type: GraphQLString },
    updated: { type: GraphQLString },
  }),
});

module.exports = CourseType;
