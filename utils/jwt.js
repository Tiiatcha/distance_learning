// src/utils/jwt.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "ourlittlesecret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "10m";

// Generate a JWT for a user
function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

// Verify and decode a JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
  createToken,
  verifyToken,
};
