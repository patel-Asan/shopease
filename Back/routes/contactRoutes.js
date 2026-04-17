const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { uploadContact } = require("../middleware/upload");

// -------------------- POST /api/contact --------------------
router.post("/", uploadContact.array("files", 5), async (req, res) => {
  try {
    const { name, email, message } = req.body;
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
      attachments
    });

    await newContact.save();

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Failed to save contact message:", err);
    res.status(500).json({ message: "Failed to save message" });
  }
});

// -------------------- GET /api/contact --------------------
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
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