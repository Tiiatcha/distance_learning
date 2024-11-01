const {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

const CourseType = require("../types/CourseType");
const {
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../../dao/repositories/courcesRepository");

const CourseMutations = {
  addCourse: {
    type: CourseType,
    args: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      collectionId: { type: new GraphQLNonNull(GraphQLInt) },
      instructor: { type: new GraphQLNonNull(GraphQLString) },
      duration: { type: new GraphQLNonNull(GraphQLInt) },
      outcome: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (parent, args, context) => {
      return createCourse(args);
    },
  },
  updateCourse: {
    type: CourseType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      collectionId: { type: GraphQLString },
      instructor: { type: GraphQLString },
      duration: { type: GraphQLInt },
      outcome: { type: GraphQLString },
    },
    resolve: async (parent, args, context) => {
      // split out id from other args
      const { id, ...fields } = args;
      return updateCourse(id, fields);
    },
  },
  deleteCourse: {
    type: CourseType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (parent, args, context) => {
      return deleteCourse(args.id);
    },
  },
};

module.exports = CourseMutations;
