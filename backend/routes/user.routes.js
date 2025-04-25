const router = require("express").Router();
const {
  getUsersByRole,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/user.controllers");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/auth.middleware");

// Current user route - must come first
router.get("/me", authMiddleware, (req, res) => {
  // Forward to getUserProfile with userId from authenticated user
  req.params.userId = req.user.userId;
  return getUserProfile(req, res);
});

// Specific routes next
router.get("/profile/:userId", authMiddleware, getUserProfile);
router.put("/profile/:userId", authMiddleware, updateUserProfile);

// Role-specific route
router.get("/role/:role", authMiddleware, getUsersByRole);

// Generic routes with parameters last - kept for backward compatibility
router.get("/:role", authMiddleware, (req, res, next) => {
  // Only proceed if role is doctor or customer
  if (["doctor", "customer"].includes(req.params.role)) {
    return getUsersByRole(req, res);
  }
  next(); // Pass to next handler if not a valid role
});

module.exports = router;
