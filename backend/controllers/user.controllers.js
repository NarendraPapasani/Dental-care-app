const User = require("../models/user.model");

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    // Validate role parameter
    if (!["doctor", "customer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role parameter. Must be 'doctor' or 'customer'",
      });
    }

    // Find users by role
    const users = await User.find({ role })
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching users",
    });
  }
};

/**
 * Get user profile by ID
 */
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching user profile",
    });
  }
};

/**
 * Update user profile
 */
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.role;

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((val) => val.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating profile",
    });
  }
};

module.exports = {
  getUsersByRole,
  getUserProfile,
  updateUserProfile,
};
