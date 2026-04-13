
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const crypto = require("crypto");
const { sendResetPasswordEmail, sendWelcomeEmail } = require("../Utils/emailService");
 
// Helper: generate access & refresh tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
  return { accessToken, refreshToken };
};
 
// ================= REGISTER =================
exports.register = async (req, res) => {
  // aapka existing code
  try {
    const { username, email, password, role } = req.body;
 
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
 
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? req.file.path : "";
    const profileImageId = req.file ? req.file.filename : "";
  
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImage,
      profileImageId,
      role: role || "user",
    });

    console.log("📧 Sending welcome email to:", user.email);
    const emailResult = await sendWelcomeEmail(user.email, user.username);
    console.log("📧 Email result:", emailResult);

    const { accessToken, refreshToken } = generateTokens(user._id);
 
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
 
    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
 
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
 
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "EMAIL_NOT_FOUND", message: "Email not found" });
    if (user.isBlocked) return res.status(403).json({ error: "USER_BLOCKED", message: "Your account is blocked." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "INCORRECT_PASSWORD", message: "Incorrect password" });
 
    const session = await Session.create({
      userId: user._id,
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
 
    const { accessToken, refreshToken } = generateTokens(user._id);
 
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
 
    res.json({
      accessToken,
      sessionId: session._id,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
 
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ================= REFRESH TOKEN =================
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });
 
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
 
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ accessToken });
 
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
 
// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { oldPassword, newPassword, newUsername } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
 
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ message: "Old password incorrect" });
    }
 
    if (newUsername) user.username = newUsername.trim();
    if (newPassword) {
      if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
      user.password = await bcrypt.hash(newPassword, 10);
    }
 
    if (req.file) {
      user.profileImage = req.file.path;
      user.profileImageId = req.file.filename;
    }

    await user.save();
 
    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
 
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ================= LOGOUT =================
exports.logout = async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"];
    if (sessionId) await Session.findByIdAndDelete(sessionId);
 
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.status(200).json({ message: "Logged out successfully" });
 
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout" });
  }
};
 
// ================= NEW: FORGOT PASSWORD =================
// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
 
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
 
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "EMAIL_NOT_FOUND" });
    }
 
    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ error: "USER_BLOCKED" });
    }
 
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
 
    // Hash token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
 
    // Save token to user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
 
    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
 
    // For development - return URL in response
    if (process.env.NODE_ENV === "development") {
      console.log("\n🔐 RESET PASSWORD LINK (copy this):");
      console.log(resetUrl);
      console.log("⚠️ This link will expire in 10 minutes\n");
 
      return res.json({ 
        success: true, 
        message: "Reset link generated (check server console)",
        resetUrl: resetUrl,
        note: "Development mode - check console for link"
      });
    }
 
    // Send email (for production)
    try {
      await sendResetPasswordEmail(user.email, resetUrl);
 
      res.json({ 
        success: true, 
        message: "Password reset link sent to your email. Please check your inbox." 
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
 
      // Clear token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
 
      // Better error message based on error type
      let errorMessage = "Failed to send reset email. ";
      if (emailError.message.includes('Authentication')) {
        errorMessage += "Email authentication failed.";
      } else if (emailError.message.includes('Connection')) {
        errorMessage += "Could not connect to email server.";
      } else {
        errorMessage += "Please try again later.";
      }
 
      return res.status(500).json({ 
        error: errorMessage
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
 
// ================= NEW: VERIFY RESET TOKEN =================
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
 
    // Hash the token from params
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
 
    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
 
    if (!user) {
      return res.status(400).json({ valid: false });
    }
 
    res.json({ valid: true });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
 
// ================= NEW: RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
 
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
 
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters" 
      });
    }
 
    // Hash the token from params
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
 
    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
 
    if (!user) {
      return res.status(400).json({ error: "INVALID_TOKEN" });
    }
 
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
 
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
 
    await user.save();
 
    res.json({ 
      success: true, 
      message: "Password reset successful" 
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
 
 
 