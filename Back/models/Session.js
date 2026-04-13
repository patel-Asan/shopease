// models/Session.js
const mongoose = require("mongoose");
 
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});
 
module.exports = mongoose.model("Session", sessionSchema);
 