const { GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql");

const CollectionType = new GraphQLObjectType({
  name: "Collection",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
  }),
});

module.exports = CollectionType;
