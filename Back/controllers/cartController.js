
const User = require("../models/User");
const Product = require("../models/Product");
 
 
// Get cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
 
    const validCart = [];
    const removedItems = [];
 
    user.cart.forEach(item => {
      if (!item.product || item.product.isDeleted) {
        removedItems.push(item.product?.name || "Unknown Product");
      } else {
        validCart.push(item);
      }
    });
 
    // Update user cart in DB
    if (removedItems.length > 0) {
      user.cart = validCart;
      await user.save();
    }
 
    // ✅ Populate after filtering just in case
    await user.populate("cart.product");
 
    res.json({
      status: "success",
      data: validCart,
      removedItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
 
// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);
 
    const index = user.cart.findIndex(i => i.product?.toString() === productId);
    if (index > -1) user.cart[index].quantity += quantity;
    else user.cart.push({ product: productId, quantity });
 
    await user.save();
    await user.populate("cart.product");
    res.json({ status: "success", message: "Added to cart", data: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Failed to add item" });
  }
};
 
// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(i => i.product?.toString() !== productId);
    await user.save();
    await user.populate("cart.product");
    res.json({ status: "success", message: "Removed from cart", data: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Failed to remove item" });
  }
};
 