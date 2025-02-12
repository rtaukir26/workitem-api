const express = require("express");
const multer = require("multer");
const {
  createProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getCategories,
} = require("../controllers/productsController");

const isAuthorized = require("../middleware/auth");

const router = express.Router();
// const upload = multer({ dest: "uploads/" });
// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Set upload folder
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // Set unique filename
});

const upload = multer({ storage });

// Route to create a product

// router.post("/create", isAuthorized, upload.single("photo"), createProduct);

//For Admin
router.post("/create", isAuthorized, upload.array("photos", 10), createProduct);
router.delete("/delete/:id", isAuthorized, deleteProduct);
router.put("/update/:id", isAuthorized, updateProduct);

//For user
//get all product
router.get("/all", getAllProducts);
//get category
router.get("/category", getCategories);
//get single product info
router.get("/info/:id", isAuthorized, getProductDetails);

module.exports = router;
