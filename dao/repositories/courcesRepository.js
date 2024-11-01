const pool = require("../../config/db");

const getAllCourses = async (args) => {
  console.log(args);
  // get all courses joining with category name
  // Base query to retrieve courses with category names
  let sqlString = `SELECT courses.*, categories.name as collectionName FROM courses
                   JOIN categories ON courses.collection = categories.id`;

  const params = [];

  // Add ORDER BY clause for sortOrder if provided
  if (args.sortOrder) {
    // Validate sortOrder to only allow 'ASC' or 'DESC' (prevents SQL injection)
    const sortOrder = args.sortOrder.toUpperCase();
    if (sortOrder !== "ASC" && sortOrder !== "DESC") {
      throw new Error("Invalid sort order. Use 'ASC' or 'DESC'.");
    }
    sqlString += ` ORDER BY title ${sortOrder}`;
  }

  // Add LIMIT clause if provided
  if (args.limit) {
    params.push(args.limit); // Add limit as a parameter
    sqlString += ` LIMIT $${params.length}`;
  }

  const result = await pool.query(sqlString, params);
  return result.rows;
};
const getCourseById = async (id) => {
  const sqlString = `SELECT courses.*, categories.name as collectionName FROM courses WHERE id = $1
  JOIN categories ON courses.collection = categories.id`;
  const result = await pool.query(sqlString, [id]);
  return result.rows[0];
};
const getCourseCollections = async () => {
  const sqlString = `SELECT * FROM categories`;
  const result = await pool.query(sqlString);
  return result.rows;
};
const getCoursesByCollection = async (collectionId) => {
  const sqlString = `SELECT courses.*, categories.name as collectionName  FROM courses WHERE collection = $1
    JOIN categories ON courses.collection = categories.id`;
  const result = await pool.query(sqlString, [collectionId]);
  return result.rows;
};

const getCourseByFields = async (fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const whereClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(" AND ");
  const sqlString = `SELECT * FROM courses WHERE ${whereClause}`;
  const result = await pool.query(sqlString, values);
  return result.rows;
};
const createCourse = async (course) => {
  const { name, description, price } = course;
  const sqlString =
    "INSERT INTO courses (name, description, price) VALUES ($1, $2, $3) RETURNING *";
  const result = await pool.query(sqlString, [name, description, price]);
  return result.rows[0];
};
const updateCourse = async (id, course) => {
  // receive course object with updated values with unknown order and unknown keys
  const fields = Object.keys(course);
  const values = Object.values(course);
  if (fields.length === 0) {
    throw new Error("At least one field is required to update a course!");
  }
  const whereClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(", ");
  const sqlString = `UPDATE courses SET ${whereClause} WHERE id = $1 RETURNING *`;
  const result = await pool.query(sqlString, [id, ...values]);
};

const deleteCourse = async (id) => {
  const sqlString = "DELETE FROM courses WHERE id = $1 RETURNING *";
  const result = await pool.query(sqlString, [id]);
  return result.rows[0];
};

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseByFields,
  getCoursesByCollection,
  createCourse,
  updateCourse,
  deleteCourse,
};
