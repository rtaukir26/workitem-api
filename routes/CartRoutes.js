const express = require("express");
const {
  addToCart,
  getCartItem,
  updateQtyCartItem,
  deleteCartItem,
} = require("../controllers/CartController");

const isAuthorized = require("../middleware/auth");

const router = express.Router();

//Add to Cart
router.post("/add-to-cart", isAuthorized, addToCart);
router.get("/cart-info/:productId", isAuthorized, getCartItem);
router.put("/update-qty", isAuthorized, updateQtyCartItem);
router.delete("/delete-cart/:productId", isAuthorized, deleteCartItem);

module.exports = router;
