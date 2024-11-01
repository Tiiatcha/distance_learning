const { getUserById } = require("../dao/repositories/userRepository");
const { createToken, verifyToken } = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);
  if (authHeader) {
    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    //console.log("Token:", token);
    try {
      // Verify the access token
      const decoded = verifyToken(token);

      // Find the user by ID
      const user = await getUserById(decoded.id);

      if (!user) {
        console.error("Authentication error: User not found.");
        req.user = null;
      } else {
        req.user = user;
      }
    } catch (error) {
      // Handle specific JWT errors
      if (error.name === "TokenExpiredError") {
        console.error("Authentication error: Token has expired.");
      } else if (error.name === "JsonWebTokenError") {
        console.error("Authentication error: Invalid token.");
      } else {
        console.error("Authentication error:", error);
      }
      req.user = null;
    }
  } else {
    // No Authorization header
    req.user = null;
  }

  next();
};

module.exports = authMiddleware;
