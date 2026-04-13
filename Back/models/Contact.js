const mongoose = require("mongoose");
 
const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if user is logged in
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String
  }],
  createdAt: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model("Contact", contactSchema);
 