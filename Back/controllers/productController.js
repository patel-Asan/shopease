const Product = require("../models/Product");
const Order = require("../models/Order");
const { cloudinary } = require("../config/cloudinary");

// Helper
const successResponse = (res, data, message = null, status = 200) =>
  res.status(status).json({ status: "success", data, message });

const errorResponse = (res, message = "Server error", data = null, status = 500) =>
  res.status(status).json({ status: "error", data, message });

// Fetch all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } } 
      ]
    }).sort({ createdAt: -1 });
 
    successResponse(res, products);
  } catch (err) {
    console.error(err);
    errorResponse(res, "Error fetching products");
  }
};
 
// Fetch single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return errorResponse(res, "Product not found", null, 404);
    successResponse(res, product);
  } catch (err) {
    console.error(err);
    errorResponse(res);
  }
};
 
// ✅ UPDATED: Create product with multiple images support
exports.createProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, description, category, stock } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      return errorResponse(res, "Name and price are required", null, 400);
    }

    // Prepare product data
    const productData = { 
      name: name.trim(),
      price: Number(price),
      description: description || '',
      category: category || 'general',
      stock: stock ? Number(stock) : 0,
      images: [],
      reviews: []
    };
    
    // Add optional fields
    if (originalPrice) productData.originalPrice = Number(originalPrice);
    
    // Handle image uploads (Cloudinary URLs)
    let uploadedImages = [];
    let uploadedImageIds = [];
    
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map(file => file.path);
      uploadedImageIds = req.files.map(file => file.filename);
      productData.images = uploadedImages;
      productData.imageIds = uploadedImageIds;
      productData.img = uploadedImages[0];
    } else if (req.file) {
      productData.img = req.file.path;
      productData.imageIds = [req.file.filename];
      productData.images = [req.file.path];
    } else {
      return errorResponse(res, "At least one product image is required", null, 400);
    }

    const product = await Product.create(productData);
    successResponse(res, product, "Product created successfully", 201);
  } catch (err) {
    console.error(err);
    errorResponse(res, "Error creating product");
  }
};
 
// ✅ UPDATED: Update product with multiple images support
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, originalPrice, description, category, stock } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, "Product not found", null, 404);
    }

    // Update fields
    if (name) product.name = name;
    if (price) product.price = Number(price);
    if (originalPrice) product.originalPrice = Number(originalPrice);
    if (description) product.description = description;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);

    // Handle image uploads (Cloudinary URLs)
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (product.imageIds && product.imageIds.length > 0) {
        for (const imageId of product.imageIds) {
          try {
            await cloudinary.uploader.destroy(imageId);
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }
      }
      
      // Upload new images
      product.images = req.files.map(file => file.path);
      product.imageIds = req.files.map(file => file.filename);
      product.img = product.images[0];
    } else if (req.file) {
      // Handle single image update
      if (product.imageIds && product.imageIds.length > 0) {
        try {
          await cloudinary.uploader.destroy(product.imageIds[0]);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      product.img = req.file.path;
      product.imageIds = [req.file.filename];
      if (!product.images || product.images.length === 0) {
        product.images = [req.file.path];
      } else {
        product.images[0] = req.file.path;
      }
    }

    await product.save();
    successResponse(res, product, "Product updated successfully");
    
  } catch (error) {
    console.error(error);
    errorResponse(res, "Error updating product");
  }
};
 
// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
 
    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, "Product not found", null, 404);
 
    // Check for pending orders
    const pendingOrder = await Order.findOne({
      "products.product": productId,
      status: { $ne: "Delivered" }
    });
 
    if (pendingOrder) {
      return errorResponse(
        res,
        "This product has pending orders. Please complete orders first.",
        null,
        400
      );
    }
 
    // Soft delete
    product.isDeleted = true;
    await product.save();
 
    successResponse(res, null, "Product deleted successfully");
 
  } catch (err) {
    console.error(err);
    errorResponse(res, "Error deleting product");
  }
};
 
// Trending products
exports.getTrendingProducts = async (req, res) => {
  try {
    const trendingProducts = await Product.find({
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    })
    .sort({ totalOrders: -1 })
    .limit(5)
    .select('name price img images totalOrders rating');

    if (!trendingProducts || trendingProducts.length === 0) {
      return successResponse(res, []);
    }

    const formattedProducts = trendingProducts.map(product => ({
      id: product._id,
      name: product.name,
      price: product.price,
      img: product.img,
      images: product.images,
      orders: product.totalOrders || 0,
      rating: product.rating || 0
    }));

    successResponse(res, formattedProducts);
  } catch (err) {
    console.error('Error fetching trending products:', err);
    errorResponse(res, "Error fetching trending products");
  }
};

// ==================== REVIEWS ====================

// Get product reviews
exports.getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('reviews')
      .populate('reviews.user', 'username profileImage');
    
    if (!product) {
      return errorResponse(res, "Product not found", null, 404);
    }
    
    successResponse(res, product.reviews);
  } catch (err) {
    console.error(err);
    errorResponse(res, "Error fetching reviews");
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    
    if (!rating || !comment) {
      return errorResponse(res, "Rating and comment are required", null, 400);
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, "Product not found", null, 404);
    }
    
    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );
    
    if (existingReview) {
      return errorResponse(res, "You have already reviewed this product", null, 400);
    }
    
    // Add new review
    const newReview = {
      user: req.user._id,
      userName: req.user.username,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };
    
    product.reviews.push(newReview);
    
    // Update average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;
    
    await product.save();
    
    successResponse(res, newReview, "Review added successfully", 201);
  } catch (err) {
    console.error(err);
    errorResponse(res, "Error adding review");
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId, reviewId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, "Product not found", null, 404);
    }
    
    const review = product.reviews.id(reviewId);
    if (!review) {
      return errorResponse(res, "Review not found", null, 404);
    }
    
    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, "Unauthorized", null, 403);
    }
    
    // Update review
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    
    // Update average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;
    
    await product.save();
    
    successResponse(res, review, "Review updated successfully");
  } catch (err) {
    console.error(err);
    errorResponse(res, "Error updating review");
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, "Product not found", null, 404);
    }
    
    const review = product.reviews.id(reviewId);
    if (!review) {
      return errorResponse(res, "Review not found", null, 404);
    }
    
    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, "Unauthorized", null, 403);
    }
    
    // Remove review
    review.deleteOne();
    
    // Update average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = totalRating / product.reviews.length;
    } else {
      product.rating = 0;
    }
    
    await product.save();
    
    successResponse(res, null, "Review deleted successfully");
  } catch (err) {
    console.error(err);
    errorResponse(res, "Error deleting review");
  }
};

// ==================== RELATED PRODUCTS ====================

// Get related products
exports.getRelatedProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const { exclude } = req.query;
    
    const relatedProducts = await Product.find({
      category: category,
      _id: { $ne: exclude },
      isDeleted: false
    })
    .sort({ totalOrders: -1, rating: -1 })
    .limit(4)
    .select('name price img images totalOrders rating');
    
    successResponse(res, relatedProducts);
  } catch (err) {
    console.error(err);
    errorResponse(res, "Error fetching related products");
  }
};