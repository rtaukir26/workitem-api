const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the User model
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products", // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: [1, "Quantity cannot be less than 1"],
        },
        totalAmount: { type: Number, default: 0 },
        price: {
          type: Number,
          required: true,
        },
        // category: { type: String, required: true },
        // description: { type: String },
        // photos: [
        //   {
        //     public_id: { type: String, required: true },
        //     url: { type: String, required: true },
        //   },
        // ],
      },
    ],
    grossTotalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Carts", CartSchema);
module.exports = Cart;
