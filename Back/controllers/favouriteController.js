
const User = require("../models/User");
const Product = require("../models/Product");
 
// Admin: get top favourite products
exports.getTopFavouriteProducts = async (req, res) => {
  try {
    // Aggregate all users' favourites
    const aggregation = await User.aggregate([
      { $unwind: "$favourites" }, // flatten favourites array
      { $group: { _id: "$favourites", count: { $sum: 1 } } }, // count favourites per product
      { $sort: { count: -1 } }, // most favourited first
      { $limit: 10 }, // top 10 products
      {
        $lookup: {
          from: "products", // products collection
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productId: "$product._id",
          name: "$product.name",
          description: "$product.description",
          price: "$product.price",
          img: "$product.img",
          likes: "$count",
        },
      },
    ]);
 
    res.json({ status: "success", data: aggregation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
// Get favourites
exports.getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favourites");
 
    // ✅ Only include products that are not soft-deleted
    const validFavourites = user.favourites.filter(p => p && !p.isDeleted);
 
    const data = validFavourites.map(p => ({
      productId: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      img: p.img,
    }));
 
    res.json({ status: "success", data });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
 
// Add to favourites
exports.addToFavourites = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
 
    if (!user.favourites.includes(productId)) user.favourites.push(productId);
    await user.save();
    await user.populate("favourites");
 
    const data = user.favourites.map(p => ({ productId: p._id, name: p.name,description:p.description, price: p.price, img: p.img }));
    res.json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
 
// Remove from favourites
exports.removeFromFavourites = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ status: "error", message: "Product ID required" });
 
    const user = await User.findById(req.user._id);
    user.favourites = user.favourites.filter(id => id.toString() !== productId);
 
    await user.save();
    await user.populate("favourites");
 
    const data = user.favourites.map(p => ({ productId: p._id, description:p.description, name: p.name, price: p.price, img: p.img }));
    res.json({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
 
 