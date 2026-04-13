
const mongoose = require("mongoose");
 
const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
});
 
const addressSchema = new mongoose.Schema({
  label: { type: String }, // Home / Office etc
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: String,
  street: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
  createdAt: { type: Date, default: Date.now },
});
 
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
  profileImageId: { type: String, default: "" },
  role: {
    type: String,
    enum: ["admin", "user", "delivery"],
    default: "user"
  },  
  isBlocked: { type: Boolean, default: false },
  cart: [cartItemSchema],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  addresses: [addressSchema],
 
  // ✅ ADD THESE TWO FIELDS FOR PASSWORD RESET
  resetPasswordToken: { 
    type: String,
    default: undefined 
  },
  resetPasswordExpire: { 
    type: Date,
    default: undefined 
  },
 
}, { timestamps: true });
 
module.exports = mongoose.model("User", userSchema);
 
 
 
 