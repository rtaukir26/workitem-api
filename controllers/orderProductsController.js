const colors = require("colors");
const OrderProducts = require("../models/orderProductsSchema");
const Cart = require("../models/CartSchema");
const { ErrorHandler } = require("../utils/helpers");

exports.orderProducts = async (req, res) => {
  try {
    const { _id: userId, email } = req.user;
    const {
      productId,
      fullName,
      phoneNumber,
      streetAddress,
      city,
      state,
      country,
      postalCode,
      addressType,
      isDefault,
    } = req.body;
    // console.log("body", req.body);
    console.log("body", req.body);
    if (!fullName || !productId) {
      return ErrorHandler(res, 404, "productId, fullName required");
    }
    // const newOrder = await OrderProducts.findOne({ userId });
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    // console.log("cart", cart);
    if (!cart) {
      return ErrorHandler(res, 404, "cart not found");
    }

    let findOrderFromCart = cart.products.find(
      (product) => product._id.toString() === productId
    );
    // console.log("findOrderFromCart", findOrderFromCart);

    let orderedProducts = await OrderProducts.findOne({ userId });

    // console.log("orderedProducts", orderedProducts);
    if (!orderedProducts) {
      // Save order details
      orderedProducts = new OrderProducts({
        userId,
        email,
        products: {
          productId: findOrderFromCart?.productId?._id,
          price: findOrderFromCart?.productId?.price,
          quantity: findOrderFromCart.quantity,
          totalAmount: findOrderFromCart.totalAmount,
        },
        grossTotalAmount:
          findOrderFromCart.quantity * findOrderFromCart?.productId?.price,
        fullName,
        //   phoneNumber,
        //   streetAddress,
        //   city,
        //   state,
        //   country,
        //   postalCode,
        //   addressType,
        //   isDefault,
      });
    } else {
      // If an existing order exists, update it
      orderedProducts.products.push({
        productId: findOrderFromCart.productId._id,
        price: findOrderFromCart.productId.price,
        quantity: findOrderFromCart.quantity,
        totalAmount:
          findOrderFromCart.quantity * findOrderFromCart.productId.price,
      });

      // Recalculate the gross total amount
      orderedProducts.grossTotalAmount = orderedProducts.products.reduce(
        (total, product) => total + product.quantity * product.price,
        0
      );

      // Update the user details if provided
      if (fullName) orderedProducts.fullName = fullName;
    }
    // console.log("orderedProducts", orderedProducts);
    const currOrder =
      orderedProducts.products[orderedProducts.products.length - 1];
    await orderedProducts.save();
    res.status(200).json({
      success: true,
      message: "you have successfully ordered your product",
      //   data: newOrder,
      //   cart,
      orderId: currOrder._id,
      ordered: currOrder,
    });
  } catch (err) {
    console.log(colors.red("Error", err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get all ordered products - Admin
exports.getAllOrderedProducts = async (req, res) => {
  try {
    let orderedProducts = await OrderProducts.find().populate(
      "products.productId"
    );
    console.log("orderedProducts", orderedProducts);
    if (!orderedProducts || orderedProducts.length === 0) {
      return ErrorHandler(res, 404, "products not found");
    }
    res.status(200).json({
      success: true,
      message: "data retrieved successfully",
      totalCart: orderedProducts.length,
      orderedProducts,
    });
  } catch (error) {
    console.log(colors.red("Error", error.message));
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
