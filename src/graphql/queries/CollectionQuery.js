const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
} = require("graphql");

const checkAuth = require("../../utils/checkAuth");

const CollectionType = require("../types/CollectionType");
const CourseType = require("../types/CourseType");

const {
  getCollections,
  getCollectionById,
  getCoursesInCollection,
} = require("../../dao/repositories/collectionsRepository");

const CollectionQueries = {
  collection: {
    type: CollectionType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (parent, args, context) => {
      checkAuth(context);
      return getCollectionById(args.id);
    },
  },
  collections: {
    type: new GraphQLList(CollectionType),
    resolve: async (parent, args, context) => {
      checkAuth(context);
      return getCollections();
    },
  },
  coursesInCollection: {
    type: new GraphQLList(CourseType),
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, context) => {
      checkAuth(context);
      return getCoursesInCollection(args.id);
    },
  },
};

module.exports = CollectionQueries;
