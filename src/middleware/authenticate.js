const { verifyToken } = require("../utils/jwt");
const { getUserById } = require("../dao/services/userServices");

const authMiddleware = async (req, res, next) => {
  console.log("Authenticating user...");
  const authHeader = req.headers.authorization;

  // Allow requests to the login endpoint to pass through without authentication
  if (req.path === "/graphql" && (req.body.query.includes("loginUser") || req.body.query.includes("registerUser"))) {
    return next();
  }

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token provided. Please log in." });
    }

    try {
      const decoded = verifyToken(token, req); // Pass req for potential token renewal
      console.log("decoded:", decoded);
      const user = await getUserById(decoded.id);
      console.log("user:", user);

      if (!user) {
        return res.status(401).json({ error: "User not found." });
      }

      req.token = token;
      req.user = user;
    } catch (error) {
      if (error.message.includes("expired")) {
        return res
          .status(401)
          .json({ error: "Token has expired. Please log in again." });
      } else {
        return res
          .status(401)
          .json({ error: "Invalid token. Please provide a valid token." });
      }
    }
  } else {
    return res.status(401).json({ error: "Authorization header is missing." });
  }

  next();
};

module.exports = authMiddleware;