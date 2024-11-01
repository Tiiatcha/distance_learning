const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
} = require("graphql");
const CourseType = require("../types/CourseType");
const {
  getAllCourses,
  getCourseById,
  getCourseByFields,
  getCoursesByCollection,
} = require("../../dao/repositories/courcesRepository");

const CourseQueries = {
  course: {
    type: CourseType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: async (parent, args, context) => {
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
      return getAllCourses(args);
    },
  },
  courseInCollection: {
    type: new GraphQLList(CourseType),
    args: {
      collection: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, context) => {
      return getCoursesByCollection(args.collection);
    },
  },
  //   courseByFields: {
  //     type: new GraphQLList(CourseType),
  //     args: {
  //       fields: { type: new GraphQLNonNull(CourseType) },
  //     },
  //     resolve: async (parent, args, context) => {
  //       return coursesRepository.getCourseByFields(args.fields);
  //     },
  //   },
};

module.exports = CourseQueries;
