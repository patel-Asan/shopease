 
const bcrypt = require("bcrypt");
const User = require("../models/User");
 
// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.json(users);
};
 
// Get all delivery boys
exports.getAllDeliveryBoys = async (req, res) => {
  const deliveryBoys = await User.find({ role: "delivery" }).select("-password");
  res.json({ data: deliveryBoys });
};
 
// Create delivery boy
exports.createDeliveryBoy = async (req, res) => {
  const { username, email, password } = req.body;
 
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already exists" });
  }
 
  const hashedPassword = await bcrypt.hash(password, 10);
 
  const deliveryBoy = await User.create({
    username,
    email,
    password: hashedPassword,
    role: "delivery",
  });
 
  res.status(201).json({
    message: "Delivery boy created successfully",
    data: deliveryBoy,
  });
};
 
// Delete user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
};
 
// Block / Unblock
exports.toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ message: "User status updated" });
};
 
// Change Role
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: "User role updated" });
};

// controllers/adminController.js - Add these if needed
exports.getTopRatedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .sort({ rating: -1, totalOrders: -1 })
      .limit(10)
      .select('name price img rating totalOrders reviews');
    
    res.json({ status: "success", data: products });
  } catch (err) {
    console.error(err);
    errorResponse(res, "Error fetching top rated products");
  }
};