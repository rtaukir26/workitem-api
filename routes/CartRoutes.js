const express = require("express");
const {
  addToCart,
  getCartItem,
  updateQtyCartItem,
  deleteCartItem,
  getAllCart,
  getTotalNumberOfAddedCart,
} = require("../controllers/CartController");

const isAuthorized = require("../middleware/auth");

const router = express.Router();

//For user
//Add to Cart
router.post("/add-to-cart", isAuthorized, addToCart);

//Get all carts
router.get("/all-cart", isAuthorized, getAllCart);

//Get single cart item
router.get("/cart-info/:productId", isAuthorized, getCartItem);

//Update qty
router.put("/update-qty", isAuthorized, updateQtyCartItem);

//delete cart
router.delete("/delete-cart/:productId", isAuthorized, deleteCartItem);

//get total no of added qty
router.get("/total-added-products", isAuthorized, getTotalNumberOfAddedCart);

module.exports = router;
