
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNotification,
} = require("../controllers/notificationController");

router.get("/", auth, getNotifications);
router.get("/count", auth, getUnreadCount);
// IMPORTANT: Specific routes MUST come BEFORE dynamic routes
router.put("/read-all", auth, markAllAsRead);  // Must be BEFORE /:id/read
router.put("/:id/read", auth, markAsRead);
router.delete("/clear-all", auth, clearAllNotifications);  // Must be BEFORE /:id
router.delete("/:id", auth, deleteNotification);

// ============================================
// TEST ENDPOINTS - NO AUTH REQUIRED
// ============================================

// Create test notification (no auth) - GET method for easy testing
router.get("/create-test", async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    const { role, type, title, message, link } = req.query;
    
    const notification = new Notification({
      role: role || "admin",
      type: type || "NEW_ORDER",
      title: title || "Test Notification - " + new Date().toISOString(),
      message: message || "This is a test notification created at " + new Date().toLocaleTimeString(),
      link: link || "/admin?page=orders"
    });
    
    await notification.save();
    
    res.json({ 
      success: true, 
      message: "Test notification created!",
      notification: {
        id: notification._id,
        role: notification.role,
        type: notification.type,
        title: notification.title,
        link: notification.link
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Test failed: " + error.message });
  }
});

// Check all notifications (no auth)
router.get("/debug-all", async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    const all = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    res.json({ 
      total: all.length, 
      notifications: all.map(n => ({ 
        _id: n._id, 
        role: n.role, 
        type: n.type, 
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        link: n.link,
        createdAt: n.createdAt 
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Debug failed: " + error.message });
  }
});

module.exports = router;
