const mongoose = require("mongoose");
const Products = require("../models/productsSchema");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { ErrorHandler } = require("../utils/helpers");
const colors = require("colors");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//create products - post req
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!req.files || !req.files.length)
      return ErrorHandler(res, 400, "No file provided");

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
          console.error(
            colors.yellow(`Error deleting temp file ${file.path}:`, err)
          );
        }
      });
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log(colors.yellow("Error creating product:", error.message));
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get single product details - get req
exports.getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ErrorHandler(res, 404, "product Id required | invalid Id ");
    }
    // Validate ID format if using MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorHandler(res, 400, "Invalid product ID");
    }
    let product = await Products.findById(id);

    if (!product) {
      return ErrorHandler(res, 404, "Product not found");
    }
    res.status(200).json({
      success: true,
      message: "data retrieved successfully",
      data: product,
    });
  } catch (err) {
    console.log(colors.red("err", err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//update product - delete req
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description } = req.body;

    if (!id) {
      return ErrorHandler(res, 404, "Product ID required | Invalid ID");
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorHandler(res, 400, "Invalid product ID");
    }

    // Find the product to update
    const product = await Products.findById(id);
    if (!product) {
      return ErrorHandler(res, 404, "Product not found");
    }

    // Handle photos - upload new ones and delete old ones
    if (req.files && req.files.length > 0) {
      // If the product already has photos, delete old ones from Cloudinary
      if (product.photos && product.photos.length > 0) {
        const deletePromises = product.photos.map((photo) =>
          cloudinary.uploader.destroy(photo.public_id)
        );
        await Promise.all(deletePromises);
        console.log(colors.green("Old photos deleted from Cloudinary."));
      }

      // Upload new photos to Cloudinary
      const photoUploads = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "products" })
      );
      const uploadedPhotos = await Promise.all(photoUploads);

      // Extract new URLs and public_ids from Cloudinary response
      const photoUrls = uploadedPhotos.map((photo) => ({
        public_id: photo.public_id,
        url: photo.secure_url,
      }));

      // Update product photos with the new ones
      product.photos = photoUrls;
    }

    // Update other fields (name, price, etc.)
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;

    // Save updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    console.log(colors.red("err updateProduct:", err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//delete product - delete req
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ErrorHandler(res, 404, "product Id required | invalid Id ");
    }
    // Validate ID format if using MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ErrorHandler(res, 400, "Invalid product ID");
    }

    let product = await Products.findById(id);

    if (!product) {
      return ErrorHandler(res, 404, "Product not found");
    }
    // Delete associated photos from Cloudinary
    if (product.photos && product.photos.length > 0) {
      const deletePromises = product.photos.map((photo) =>
        cloudinary.uploader.destroy(photo.public_id)
      );
      await Promise.all(deletePromises);
      console.log(colors.green("Photos deleted from Cloudinary with Id.", id));
    }

    // Delete the product from the database
    await Products.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (err) {
    console.log(colors.red("err deleteProduct:", err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
