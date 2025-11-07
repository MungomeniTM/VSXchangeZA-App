import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Update user profile (secured with authMiddleware)
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.sub; // user ID from JWT
    const { first_name, last_name, email, password, location, avatar_url, role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update fields only if provided
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (email !== undefined) user.email = email.toLowerCase().trim();
    if (location !== undefined) user.location = location;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;
    if (role !== undefined) user.role = role;

    // Handle password update if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        location: user.location,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get current user profile (optional)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      location: user.location,
      avatar_url: user.avatar_url,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};