const mongoose = require("mongoose");
const orderProductSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: [1, "Quantity cannot be less than 1"],
        },
        totalAmount: { type: Number, default: 0 },
      },
    ],

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    grossTotalAmount: {
      type: Number,
      default: 0,
    },
    // phoneNumber: {
    //   type: String,
    //   required: [true, "Phone number is required"],
    //   match: [/^\d{10}$/, "Phone number must be 10 digits"], // Adjust regex based on your region
    // },

    // streetAddress: {
    //   type: String,
    //   //   required: [true, "Street address is required"],
    //   trim: true,
    // },
    // city: {
    //   type: String,
    //   required: [true, "City is required"],
    //   trim: true,
    // },
    // state: {
    //   type: String,
    //   required: [true, "State is required"],
    //   trim: true,
    // },
    // country: {
    //   type: String,
    //   required: [true, "Country is required"],
    //   trim: true,
    //   default: "India", // Replace with your default country
    // },
    // postalCode: {
    //   type: String,
    //   required: [true, "Postal code is required"],
    //   //   match: [/^\d{5}(-\d{4})?$/, "Please enter a valid postal code"], // U.S. format, adjust as needed
    //   match: [/^\d{6}$/, "Please enter a valid 6-digit postal code"], //indian format
    // },
    // addressType: {
    //   type: String,
    //   enum: ["Home", "Work", "Other"],
    //   default: "Home",
    // },
    // isDefault: {
    //   type: Boolean,
    //   default: false, // Helps identify the default address
    // },
  },

  { timestamps: true }
);

const OrderProducts = mongoose.model("orderproducts", orderProductSchema);

module.exports = OrderProducts;
