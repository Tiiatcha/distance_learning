const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
} = require("graphql");

const checkAuth = require("../../utils/checkAuth");

const CourseType = require("../types/CourseType");
const {
  getAllCourses,
  getCourseById,
  getCourseByFields,
} = require("../../dao/repositories/courcesRepository");

const CourseQueries = {
  course: {
    type: CourseType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (parent, args, context) => {
      checkAuth(context);
      return getCourseById(args.id);
    },
  },
  courses: {
    type: new GraphQLList(CourseType),
    // optional args for limit and sortOrder (Enum: ASC, DESC)
    args: {
      limit: { type: GraphQLInt },
      sortOrder: {
        type: new GraphQLEnumType({
          name: "SortOrder",
          values: {
            ASC: { value: "ASC" },
            DESC: { value: "DESC" },
          },
        }),
      },
    },
    resolve: async (parent, args, context) => {
      checkAuth(context);
      return getAllCourses(args);
    },
  },
};

module.exports = CourseQueries;
