 
// routes/favouriteRoutes.js
const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { getTopFavouriteProducts, getFavourites, addToFavourites, removeFromFavourites } = require("../controllers/favouriteController");
 
// existing routes
router.get("/", auth, getFavourites);
router.post("/add", auth, addToFavourites);
router.post("/remove", auth, removeFromFavourites);
 
// new route for admin
router.get("/top", auth, getTopFavouriteProducts);
 
module.exports = router;
 
 