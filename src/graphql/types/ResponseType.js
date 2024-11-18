const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} = require("graphql");

const UserType = require("./UserType");
const CourseType = require("./CourseType");
const CollectionType = require("./CollectionType");

const ResponseType = new GraphQLObjectType({
  name: "Response",
  fields: () => ({
    message: { type: GraphQLString },
    user: { type: UserType },
    course: { type: CourseType },
    collection: { type: CollectionType },
    users: { type: new GraphQLList(UserType) },
    courses: { type: new GraphQLList(CourseType) },
    collections: { type: new GraphQLList(CollectionType) },
    count: { type: GraphQLInt },
    token: { type: GraphQLString },
    error: { type: GraphQLString },
  }),
});

module.exports = ResponseType;
