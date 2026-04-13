const router = require("express").Router();
const { getCart, addToCart, removeFromCart } = require("../controllers/cartController");
const { auth } = require("../middleware/auth");
 
router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.post("/remove", auth, removeFromCart);
 
module.exports = router;
 