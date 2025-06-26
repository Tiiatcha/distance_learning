const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const { createToken, verifyToken } = require("../../utils/jwt");
const checkRole = require("../../utils/checkRole");


/**
 * Get user by id
 * @param {number} id
 * @returns {object} User
 * @throws {Error} If no id provided
 * @throws {Error} If user not found
 * @returns {object} User
 */
const getUserById = async (id) => {
  if (!id) throw new Error("Id is required.");
  try {
    const result = await userRepository.getUserById(id);
    console.log('result:', result);
    return result;
  } catch (error) {
    console.error("Error in getUserById service:", error);
    throw new Error("User not found.");
  }
}


/**
 * Validates password and repeatPassword for registration.
 * @param {string} password
 * @param {string} repeatPassword
 * @returns {void}
 */
const passwordValidation = (password, repeatPassword) => {
  if (!password) throw new Error("Password is required.");
  if (!validator.isLength(password, { min: 8 }))
    throw new Error("Password must be at least 8 characters.");
  if (!repeatPassword) throw new Error("Repeat password is required.");
  if (password !== repeatPassword) throw new Error("Passwords do not match.");
};

/**
 * Validates email and username for registration. does
 * not allow duplicate emails or usernames. does not return any data.
 * @param {string} username
 * @param {string} email
 * @returns {void}
 */
const emailUsernameValidation = async ({ username, email }) => {
  console.log(username, email);
  if (!username) throw new Error("Username is required.");
  if (!email) throw new Error("Email is required.");
  if (!validator.isAlphanumeric(username))
    throw new Error("Username must be alphanumeric.");
  if (!validator.isLength(username, { min: 3, max: 20 }))
    throw new Error("Username must be between 3 and 20 characters.");
  if (!validator.isEmail(email)) throw new Error("Email is not valid.");


  try {
    const existingUser = await userRepository.getUsersByFields({
      email,
      username,
    });
    if (existingUser.length > 0) {
      if (existingUser.some((user) => user.email === email)) {
        throw new Error("Email is already taken.");
      }
      if (existingUser.some((user) => user.username === username)) {
        throw new Error("Username is already taken.");
      }
    }
  } catch (error) {
    throw new Error("Error checking user and email: " + error.message);
  }
};

/**
 * Creates a new user with while hashing the password.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} repeatPassword
 * @param {string} role - defaults to 'USER'
 * @returns {object} Created user
 */
const userRegistration = async (user) => {
  const { username, email, password, repeatPassword } = user;
  //console.log('registering user:', user);
  // validate email and username
  await emailUsernameValidation({ email, username });

  // validate password
  passwordValidation(password, repeatPassword);

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await userRepository.insertUser(
    username,
    email,
    hashedPassword,
    "USER"
  );

  const newToken = createToken({ id: result.id, role: "USER" });

  return { user: result, count: 1, token: newToken };
};

/**
 * Logs in a user with a username and password.
 * @param {{string}} username
 * @param {{string}} password
 * @returns {object} Logged in user and token
 */
const loginUser = async (user) => {
  const { username, password } = user;
  console.log('getting details for user:', username);
  // check username is provided
  if (!username) throw new Error("Username is required.");

  // check password is provided
  if (!password) throw new Error("Password is required.");

  const result = await userRepository.getUsersByFields({ username });
  user = result[0];
  if (!user) {
    throw new Error("Invalid credentials (username).");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials (password).");
  }
  user.password_hash = "***";
  const newToken = createToken({ id: user.id, role: user.role });

  return { user, count: 1, token: newToken };
};

/**
 * Delete user by username providing current user is an admin or the user themselves.
 * @param {string} username
 * @returns {object} Deleted user
 */
const deleteUser = async (username, context) => {
  let token;
  try {
    // check if user is deleting themselves
    if (context.user.username !== username) {
      // check if user is an admin
      checkRole(context, "ADMIN");
      token = context.token;
    }

    // delete user
    const result = await userRepository.deleteUser(username);

    // construct response object
    const response = {
      user: result,
      count: 1,
    };
    // add token to response if it exists (for admins only)
    if (token) response.token = token;
    // return response
    return response;
  } catch (error) {
    console.error("Error in deleteUser service:", error);
    throw new Error("Could not delete user.");
  }
};

module.exports = {
  userRegistration,
  loginUser,
  deleteUser,
  getUserById,
  // getAllUsers,
};
