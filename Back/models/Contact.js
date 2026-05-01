const mongoose = require("mongoose");
 
const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  category: {
    type: String,
    enum: ["complaint", "inquiry", "feedback", "bug_report"],
    default: "inquiry"
  },
  priority: {
    type: String,
    enum: ["urgent", "normal", "low"],
    default: "normal"
  },
  isRead: { type: Boolean, default: false },
  reply: { type: String, default: "" },
  replyAt: { type: Date },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String
  }],
  createdAt: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model("Contact", contactSchema);
