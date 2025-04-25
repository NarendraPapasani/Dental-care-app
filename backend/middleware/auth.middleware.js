const jwt = require("jsonwebtoken");

/**
 * Authentication middleware
 * Verifies JWT token from request header and adds user data to request object
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user data to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
    });
  }
};

/**
 * Role-based authorization middleware
 * Checks if the authenticated user has the required role
 * @param {Array} roles - Array of allowed roles
 */
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You don't have permission to access this resource",
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  authorizeRoles,
};
