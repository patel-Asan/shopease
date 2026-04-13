const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");
const fs = require("fs");
 
// -------------------- Multer config for file uploads --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/contact";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
 
// -------------------- POST /api/contact --------------------
router.post("/", upload.array("files"), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const files = req.files || [];
 
    // -------------------- Save to DB --------------------
    const newContact = new Contact({
      name,
      email,
      message,
      attachments: files.map(f => ({
        filename: f.originalname,
        path: f.path,
        mimetype: f.mimetype
      }))
    });
 
    await newContact.save(); // Always save first
 
    // -------------------- Send Email to Admin --------------------
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "myshop@gmail.com",
        pass: "your-app-password", // Use Gmail App Password
      },
    });
 
    // Send email in a try-catch so it won't block user response
    transporter.sendMail({
      from: `"${name}" <myshop@gmail.com>`,
      replyTo: email,
      to: "myshop@gmail.com",
      subject: `New Contact Message from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
      attachments: files.map(f => ({
        filename: f.originalname,
        path: f.path,
        contentType: f.mimetype
      })),
    }).catch(err => {
      // console.error("Email send failed:", err); 
    });
 
    // -------------------- Respond to User --------------------
    res.status(200).json({ message: "Message Send successfully!" });
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
 
    // Optional: delete attached files from server
    deleted.attachments.forEach(f => {
      if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
    });
 
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete message" });
  }
});
 
module.exports = router;