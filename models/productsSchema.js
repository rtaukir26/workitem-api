const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    // photo: {
    //   url: { type: String, required: true }, // URL of the uploaded photo
    //   public_id: { type: String, required: true }, // Public ID from Cloudinary
    // },
    photos: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Products = mongoose.model("products", productsSchema);

module.exports = Products;
