 
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");
 
// Update session activity middleware
const updateSessionActivity = async (req, res, next) => {
  try {
    const sessionId = req.headers["x-session-id"];
    if (sessionId) {
      await Session.findByIdAndUpdate(sessionId, { lastActivity: new Date() });
    }
  } catch (err) {
    console.error("Failed to update session activity:", err);
  }
  next();
};
 
// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked." });
    }
 
    req.user = user;
    next();
 
  } catch (err) {
 
    // 🔥 Handle token expired separately
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
 
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
 
    return res.status(500).json({ message: "Server error" });
  }
};
 
// Admin middleware
const adminAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};
 
 
 
 
const deliveryAuth = (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ message: "Unauthorized" });
 
  if (req.user.role !== "delivery")
    return res.status(403).json({ message: "Delivery only" });
 
  next();
};
 
module.exports = { auth, adminAuth, deliveryAuth, updateSessionActivity };
 