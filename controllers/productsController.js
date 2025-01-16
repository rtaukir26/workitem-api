const Products = require("../models/productsSchema");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!req.files || !req.files.length) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    // Upload multiple files to Cloudinary
    const photoUploads = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "products" })
    );

    const uploadedPhotos = await Promise.all(photoUploads);

    // Extract URLs from uploaded photos
    const photoUrls = uploadedPhotos.map((photo) => ({
      public_id: photo.public_id,
      url: photo.secure_url,
    }));

    // Create product document
    const product = await Products.create({
      name,
      price,
      category,
      description,
      photos: photoUrls,
      //   photo: {
      //     url: result.secure_url,
      //     public_id: result.public_id,
      //   },
    });
    // Cleanup temporary files
    req.files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting temp file ${file.path}:`, err);
        }
      });
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};
