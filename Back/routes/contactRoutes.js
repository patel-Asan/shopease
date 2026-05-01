const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { uploadContact } = require("../middleware/upload");

// -------------------- POST /api/contact --------------------
router.post("/", uploadContact.array("files", 5), async (req, res) => {
  try {
    const { name, email, message, category, priority } = req.body;
    const files = req.files || [];

    const attachments = files.map(f => ({
      filename: f.originalname,
      path: f.path,
      mimetype: f.mimetype
    }));

    const newContact = new Contact({
      name,
      email,
      message,
      category: category || "inquiry",
      priority: priority || "normal",
      attachments
    });

    await newContact.save();

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Failed to save contact message:", err);
    res.status(500).json({ message: "Failed to save message" });
  }
});

// -------------------- GET /api/contact (with filters) --------------------
router.get("/", async (req, res) => {
  try {
    const { search, category, priority, status, sortBy } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }
    if (category && category !== "all") filter.category = category;
    if (priority && priority !== "all") filter.priority = priority;
    if (status === "unread") filter.isRead = false;
    if (status === "replied") filter.reply = { $ne: "" };

    const sortField = sortBy === "priority" ? { priority: 1, createdAt: -1 } : { createdAt: -1 };

    const messages = await Contact.find(filter).sort(sortField);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// -------------------- POST /api/contact/:id/reply --------------------
router.post("/:id/reply", async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { reply: reply.trim(), replyAt: new Date(), isRead: true },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Message not found" });

    res.json({ message: "Reply sent successfully", contact: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reply" });
  }
});

// -------------------- PATCH /api/contact/:id/read --------------------
router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update" });
  }
});

// -------------------- DELETE /api/contact/:id --------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete message" });
  }
});

module.exports = router;
