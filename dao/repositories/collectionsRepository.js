const pool = require("../config/db");

// const Get all collections
const getCollections = async () => {
  const sqlString = `SELECT * FROM categories`;
  const result = await pool.query(sqlString);
  return result.rows;
};
const getCoursesInCollection = async (collectionId) => {
  const sqlString = `SELECT * FROM courses WHERE collection = $1
    JOIN categories ON courses.collection = categories.id`;
  const result = await pool.query(sqlString, [collectionId]);
  return result.rows;
};
// const Get collection by id
const getCollectionById = async (id) => {
  const sqlString = `SELECT * FROM categories WHERE id = $1`;
  const result = await pool.query(sqlString, [id]);
  return result.rows[0];
};
const createCollection = async (collection) => {
  const { name } = collection;
  const sqlString = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
  const result = await pool.query(sqlString, [name]);
  return result.rows[0];
};
const updateCollection = async (id, collection) => {
  const { name } = collection;
  const sqlString = `UPDATE categories SET name = $2 WHERE id = $1 RETURNING *`;
  const result = await pool.query(sqlString, [id, name]);
  return result.rows[0];
};
const deleteCollection = async (id) => {
  const sqlString = `DELETE FROM categories WHERE id = $1 RETURNING *`;
  const result = await pool.query(sqlString, [id]);
  return result.rows[0];
};

module.exports = {
  getCollections,
  getCollectionById,
  getCoursesInCollection,
  createCollection,
  updateCollection,
  deleteCollection,
};
