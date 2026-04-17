
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

exports.createNotification = async ({
  userId = null,
  role = "all",
  type,
  title,
  message,
  link = null,
  metadata = {},
}) => {
  try {
    // Convert userId to ObjectId if it's a valid string
    let finalUserId = null;
    if (userId) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        finalUserId = new mongoose.Types.ObjectId(userId);
      } else if (typeof userId === 'object' && userId._id) {
        finalUserId = userId._id;
      }
    }
    
    const notification = new Notification({
      userId: finalUserId,
      role,
      type,
      title,
      message,
      link,
      metadata,
    });
    
    const saved = await notification.save();
    console.log(`✅ Notification created: [${role}] ${type} - ${title}`);
    return saved;
  } catch (error) {
    console.error(`❌ Failed to create notification [${type}]:`, error.message);
    return null;
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;
    const { page = 1, limit = 20, unreadOnly } = req.query;

    let query = {};

    if (role === "admin") {
      query.role = { $in: ["admin", "all"] };
    } else if (role === "delivery") {
      query.role = { $in: ["delivery", "all"] };
    } else if (role === "user" && userId) {
      query.$or = [
        { role: "user", userId: userId },
        { role: "all" },
      ];
    }

    if (unreadOnly === "true") {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;

    let query = {};

    if (role === "admin") {
      query.role = { $in: ["admin", "all"] };
    } else if (role === "delivery") {
      query.role = { $in: ["delivery", "all"] };
    } else if (role === "user" && userId) {
      query.$or = [
        { role: "user", userId: userId },
        { role: "all" },
      ];
    }

    const count = await Notification.countDocuments({ ...query, isRead: false });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, _id: userId } = req.user;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const isAuthorized = 
      notification.role === "all" ||
      notification.role === role ||
      (notification.role === "user" && notification.userId?.toString() === userId?.toString());
    
    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized to access this notification" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { role, _id: userId } = req.user;

    let query = {};

    if (role === "admin") {
      query.role = { $in: ["admin", "all"] };
    } else if (role === "delivery") {
      query.role = { $in: ["delivery", "all"] };
    } else if (role === "user" && userId) {
      query.$or = [
        { role: "user", userId: userId },
        { role: "all" },
      ];
    }

    await Notification.updateMany({ ...query, isRead: false }, { isRead: true });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, _id: userId } = req.user;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const isAuthorized = 
      notification.role === "all" ||
      notification.role === role ||
      (notification.role === "user" && notification.userId?.toString() === userId?.toString());
    
    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized to delete this notification" });
    }

    await Notification.findByIdAndDelete(id);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    const { role, _id } = req.user;

    let query = {};

    // Build query based on role
    if (role === "admin") {
      query = { role: { $in: ["admin", "all"] } };
    } else if (role === "delivery") {
      query = { role: { $in: ["delivery", "all"] } };
    } else if (role === "user") {
      query = {
        $or: [
          { role: "user", userId: _id },
          { role: "all" }
        ]
      };
    } else {
      return res.json({ message: "No notifications to clear", deletedCount: 0 });
    }

    const result = await Notification.deleteMany(query);
    
    res.json({ message: "All notifications cleared", deletedCount: result.deletedCount || 0 });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear notifications" });
  }
};
