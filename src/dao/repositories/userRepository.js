const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

const { createToken, verifyToken } = require("../../utils/jwt");
const e = require("cors");

const insertUser = async (username, email, password_hash, role) => {
  try {
    const sqlString = `INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(sqlString, [
      username,
      email,
      password_hash,
      role || "USER",
    ]);
    result.rows[0].password_hash = undefined;
    return result.rows[0];
  } catch (error) {
    // Handle specific database errors
    if (error.code === "23505") {
      // Unique violation
      throw new Error("Email or username already exists.");
    }
    throw new Error("An error occurred while creating the user.");
  }
};

const deleteUser = async (username) => {
  // TODO: Change to not delete but to deactivate the user and anonymize the data
  console.log("Deleting user:", username);
  const sqlString = `DELETE FROM users WHERE username = $1 AND role != $2 RETURNING *`;

  try {
    const result = await pool.query(sqlString, [username, "ADMIN"]);

    if (result.rows.length === 0) throw new Error("User not found.");

    return result.rows[0];
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Could not delete user.");
  }
};

const getAllUsers = async (args) => {
  console.log(args);
  let sqlString = `SELECT * FROM users`;

  const params = [];

  if (args.sortOrder) {
    const sortOrder = args.sortOrder.toUpperCase();
    if (sortOrder !== "ASC" && sortOrder !== "DESC") {
      throw new Error("Invalid sort order. Use 'ASC' or 'DESC'.");
    }
    sqlString += ` ORDER BY username ${sortOrder}`;
  }

  if (args.limit) {
    params.push(args.limit);
    sqlString += ` LIMIT $${params.length}`;
  }

  const result = await pool.query(sqlString, params);
  return result.rows;
};
/**
 * Get a user by their id
 */
const getUserById = async (id) => {
  const sqlString = `SELECT * FROM users WHERE id = $1`;
  const result = await pool.query(sqlString, [id]);
  return result.rows[0];
};

/***
 * Get a user by their username
 * @param {string} username
 * @returns {object} User object
 */
const getUserByUsername = async (username) => {
  const sqlString = `SELECT * FROM users WHERE username = $1`;
  const result = await pool.query(sqlString, [id]);
  return result.rows[0];
};
// Get users based on any number of fields and values in the where clause.
// THere is also an option to match all or any of the fields.

const getUsersByFields = async (fields, matchAll = true) => {
  const fieldNames = Object.keys(fields);
  const fieldValues = Object.values(fields);

  if (fieldNames.length === 0) {
    throw new Error("No fields provided for query");
  }

  let sqlString = `SELECT * FROM users WHERE `;
  const params = [];
  let count = 1;

  // Use Array.prototype.map to create the where clause
  const whereClause = fieldNames
    .map((field, index) => {
      params.push(fieldValues[index]);
      return `${field} = $${count++}`;
    })
    .join(` ${matchAll ? "AND" : "OR"} `); // Join with AND/OR based on matchAll
    console.log(sqlString + whereClause);
    console.log(params);
  const result = await pool.query(sqlString + whereClause, params);
    console.log('users:', result.rows);
  return result.rows;
};

module.exports = {
  insertUser,
  getUserById,
  deleteUser,
  getUserByUsername,
  getUsersByFields,
};
