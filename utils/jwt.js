// src/utils/jwt.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "ourlittlesecret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "10m";
const TOKEN_EXPIRATION_THRESHOLD = 120;

// Generate a JWT for a user
function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

// Verify and decode a JWT

function verifyToken(token, context) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const isExpiringSoon =
      decoded.exp - currentTime < TOKEN_EXPIRATION_THRESHOLD;

    // Renew the token if it's expiring soon
    if (isExpiringSoon) {
      const newToken = jwt.sign(
        { id: decoded.id, role: context.user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      ); // Change expiration as needed
      return newToken;
    }

    return decoded; // Return the decoded token if no renewal is needed
  } catch (error) {
    console.error("Invalid or expired token:", error.message);
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
  createToken,
  verifyToken,
};
