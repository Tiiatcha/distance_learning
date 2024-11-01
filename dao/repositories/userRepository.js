const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

const { createToken, verifyToken } = require("../../utils/jwt");
const e = require("cors");

const userRegistration = async (user) => {
  const { username, email, password, repeatPassword } = user;
  if (password !== repeatPassword) {
    throw new Error("Passwords do not match.");
  }

  // select user by email or username which may result in two records to check
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1 OR username = $2",
    [email, username]
  );
  console.log(existingUser);
  // assuming upto two records are returned
  // check if email is incluced in the returned records
  // then check if username is included in the returned records
  if (existingUser.rows.length > 0) {
    // use an array method to check if email is included in the returned records
    const isEmailTaken = existingUser.rows.some((user) => user.email === email);
    const isUsernameTaken = existingUser.rows.some(
      (user) => user.username === username
    );
    if (isEmailTaken) throw new Error("Email is already taken.");
    if (isUsernameTaken) throw new Error("Username is already taken.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sqlString =
    "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *";
  console.log(sqlString);
  const result = await pool.query(sqlString, [
    username,
    email,
    hashedPassword,
    "USER",
  ]);

  // move this to a separate function
  const newToken = createToken({ id: result.rows[0].id, role: "USER" });

  return { user: result.rows[0], token: newToken };
};

loginUser = async (user) => {
  const { username, password } = user;

  const sqlString = "SELECT * FROM users WHERE username = $1";
  const result = await pool.query(sqlString, [username]);
  if (result.rows.length === 0) {
    throw new Error("Invalid credentials (username).");
  }
  const userRecord = result.rows[0];
  const isPasswordValid = await bcrypt.compare(
    password,
    userRecord.password_hash
  );
  if (!isPasswordValid) {
    throw new Error("Invalid credentials (password).");
  }

  const newToken = createToken({ id: result.rows[0].id, role: "USER" });

  return { user: userRecord, token: newToken, count: 1 };
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
const getUserById = async (id) => {
  const sqlString = `SELECT * FROM users WHERE id = $1`;
  const result = await pool.query(sqlString, [id]);
  return result.rows[0];
};

module.exports = {
  userRegistration,
  loginUser,
  getAllUsers,
  getUserById,
};
