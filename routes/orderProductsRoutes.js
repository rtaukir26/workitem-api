const express = require("express");
const isAuthorized = require("../middleware/auth");
const {
  orderProducts,
  getAllOrderedProducts,
} = require("../controllers/orderProductsController");

const router = express.Router();

//order products/buy/submit
router.post("/buy", isAuthorized, orderProducts);

//get all ordered products
router.get("/all", isAuthorized, getAllOrderedProducts);

module.exports = router;
