const express = require("express");
const isAuthorized = require("../middleware/auth");
const {
  orderProducts,
  getAllOrderedProducts,
} = require("../controllers/orderProductsController");

const router = express.Router();

//order products/submit
router.post("/submit", isAuthorized, orderProducts);
router.get("/all", isAuthorized, getAllOrderedProducts);

module.exports = router;
