 
const bcrypt = require("bcrypt");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
 
// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        status: "error", 
        message: "User not found" 
      });
    }
    res.json({ 
      status: "success", 
      data: user 
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ 
      status: "error", 
      message: "Server error" 
    });
  }
};
 
// ========== MAIN UPDATE PROFILE FUNCTION ==========
exports.updateProfile = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
 
    // Detailed debug log
    console.log("🔍 ===== UPDATE PROFILE REQUEST =====");
    console.log("User ID:", req.user?._id);
    console.log("Username received:", username);
    console.log("Old password received:", oldPassword ? "✅ Yes" : "❌ No");
    console.log("New password received:", newPassword ? "✅ Yes" : "❌ No");
    console.log("File received:", req.file ? `✅ ${req.file.filename}` : "❌ No");
    console.log("=====================================");
 
    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
 
    // ===== PASSWORD CHANGE LOGIC =====
    // Only validate old password if new password is provided
    if (newPassword && newPassword.trim() !== "") {
      console.log("🔐 Password change requested");
 
      // Check if old password was provided
      if (!oldPassword) {
        console.log("❌ Old password missing");
        return res.status(400).json({
          status: "error",
          message: "Old password is required to change password",
        });
      }
 
      // Compare old password with database
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      console.log("🔐 Password match:", isMatch ? "✅ YES" : "❌ NO");
 
      if (!isMatch) {
        console.log("❌ Old password incorrect");
        return res.status(400).json({
          status: "error",
          message: "Old password is incorrect",
        });
      }
 
      // Validate new password length
      if (newPassword.length < 6) {
        console.log("❌ New password too short");
        return res.status(400).json({
          status: "error",
          message: "New password must be at least 6 characters",
        });
      }
 
      // Hash and save new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      console.log("✅ New password hashed and saved");
    } else {
      console.log("ℹ️ No password change requested");
    }
 
    // ===== USERNAME UPDATE =====
    if (username && username.trim() !== "") {
      // Optional: Check if username is taken (if you want)
      // const existingUser = await User.findOne({ username: username.trim(), _id: { $ne: user._id } });
      // if (existingUser) {
      //   return res.status(400).json({
      //     status: "error",
      //     message: "Username already taken",
      //   });
      // }
 
      user.username = username.trim();
      console.log("✅ Username updated to:", username);
    }
 
    // ===== PROFILE IMAGE UPDATE =====
    if (req.file) {
      console.log("🖼️ Processing image upload");
 
      // Delete old image if exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "../uploads/profile", user.profileImage);
 
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("✅ Old image deleted:", user.profileImage);
          }
        } catch (fileErr) {
          console.error("⚠️ Error deleting old image:", fileErr.message);
          // Continue even if old image deletion fails
        }
      }
 
      // Save new image
      user.profileImage = req.file.filename;
      console.log("✅ New image saved:", req.file.filename);
    }
 
    // Save all changes
    await user.save();
    console.log("✅ User saved successfully");
 
    // Return updated user data
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
 
  } catch (error) {
    console.error("❌ UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      status: "error",
      message: "Server error. Please try again later.",
    });
  }
};
 
// Address management functions
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ 
      status: "success", 
      data: user.addresses 
    });
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to add address" 
    });
  }
};
 
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(id);
 
    if (!address) {
      return res.status(404).json({ 
        status: "error", 
        message: "Address not found" 
      });
    }
 
    Object.assign(address, req.body);
    await user.save();
 
    res.json({ 
      status: "success", 
      data: user.addresses 
    });
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to update address" 
    });
  }
};
 
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
 
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== id);
    await user.save();
 
    res.json({ 
      status: "success", 
      data: user.addresses 
    });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to delete address" 
    });
  }
};
 
