const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
} = require("graphql");

const CollectionType = require("../types/CollectionType");

const {
  getAllCollections,
  getCollectionById,
  getCoursesInCollection,
} = require("../../dao/repositories/collectionRepository");

const CollectionQueries = {
  collection: {
    type: CollectionType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (parent, args, context) => {
      return getCollectionById(args.id);
    },
  },
  collections: {
    type: new GraphQLList(CollectionType),
    resolve: async () => {
      return getAllCollections();
    },
  },
  coursesInCollection: {
    type: new GraphQLList(CollectionType),
    args: {
      collection: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, context) => {
      return getCoursesInCollection(args.collection);
    },
  },
};
