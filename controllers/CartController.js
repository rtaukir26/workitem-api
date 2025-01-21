const Cart = require("../models/CartSchema");
const Products = require("../models/productsSchema");
const colors = require("colors");

const { ErrorHandler } = require("../utils/helpers");

//product Add to cart - post req
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { _id: userId } = req.user;

    if (!productId) {
      return ErrorHandler(res, 404, "product Id required");
    }

    let cart = await Cart.findOne({ userId });
    // console.log("cart", cart);

    let product = await Products.findById(productId);

    // console.log("product", product);
    if (!product) {
      return ErrorHandler(res, 404, "product not found in Products");
    }

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            price: product.price,
            quantity,
            totalAmount: quantity * product.price,
          },
        ],
        grossTotalAmount: quantity * product.price,
      });
    } else {
      // Check if product already exists in the cart
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Update quantity
        cart.products[productIndex].quantity += quantity;
        cart.products[productIndex].totalAmount += quantity * product.price;
        cart.grossTotalAmount =
          cart.grossTotalAmount + quantity * product.price;
      } else {
        // Add new product
        cart.products.push({
          productId,
          quantity,
          price: product.price,
          totalAmount: quantity * product.price,
        });
        // Update total amount
        cart.grossTotalAmount += quantity * product.price;
      }
    }

    await cart.save();
    await cart.populate("products.productId");

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//get all cart items - get req
exports.getAllCart = async (req, res) => {
  try {
    let cart = await Cart.find().populate("products.productId");

    if (!cart || cart.length === 0) {
      return ErrorHandler(res, 404, "carts not found");
    }
    res.status(200).json({
      success: true,
      message: "carts retrieved successfully",
      totalCart: cart.length,
      cart,
    });
  } catch (error) {
    console.log(colors.red("Error", error.message));
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get single cart info - get req
exports.getCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { _id: userId } = req.user;

    // console.log("user", userId, productId);

    if (!productId) {
      return ErrorHandler(res, 404, "product Id required");
    }

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    // const cart = await Cart.findOne({userId});
    // console.log("cart", cart);

    if (!cart) {
      return ErrorHandler(res, 404, "carts not found");
    }

    const singleProduct = cart?.products?.find(
      (product) => product?.productId?._id?.toString() === productId?.toString()
    );
    // console.log("singleProduct", singleProduct);
    if (!singleProduct) {
      return ErrorHandler(res, 404, "cart not found | invalid Id");
    }
    res.status(200).json({
      success: true,
      message: "data retrieved successfully",
      cart: singleProduct,
    });
  } catch (err) {
    console.log(colors.red("Error", err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//update quantity cart item - put req
exports.updateQtyCartItem = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { productId, quantity } = req.body;

    // console.log("body", req.body, userId);

    if (!productId || !quantity) {
      return ErrorHandler(res, 404, "product Id, quantity  required");
    }
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    console.log("cart", cart);

    if (!cart) {
      return ErrorHandler(res, 404, "cart not found");
    }

    const productIndex = cart.products?.findIndex(
      (product) => product?.productId._id?.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      cart.products[productIndex].totalAmount =
        quantity * cart.products[productIndex].price;
      cart.grossTotalAmount = cart.products.reduce((acc, item) => {
        return (acc = acc + item.totalAmount);
      }, 0);
    } else {
      return ErrorHandler(res, 404, "singleCart not found");
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "cart quantity updated successfully",
      cart,
    });
  } catch (err) {
    console.log(colors.red("Error", err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//delete item from cart - delete req
exports.deleteCartItem = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { productId } = req.params;

    if (!productId) {
      return ErrorHandler(res, 404, "product Id  required");
    }
    const cart = await Cart.findOne({ userId });
    // console.log("cart", cart);

    if (!cart) {
      return ErrorHandler(res, 404, "cart not found");
    }

    const productIndex = cart.products?.findIndex(
      (product) => product?.productId.toString() === productId
    );

    if (productIndex > -1) {
      // Remove the product from the cart
      cart.products.splice(productIndex, 1); // Removes the product at the index

      cart.grossTotalAmount = cart.products.reduce((acc, item) => {
        return (acc = acc + item.totalAmount);
      }, 0);
    } else {
      return ErrorHandler(res, 404, "cart item not found");
    }

    //if cart empty
    if (cart.products.length === 0) {
      cart.grossTotalAmount = 0;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "cart item deleted and retrieved remains data successfully",
      cart,
    });
  } catch (err) {
    console.log(colors.red("Error", err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//total no of added products in cart
exports.getTotalNumberOfAddedCart = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    // console.log("cart", cart);

    if (!cart) {
      return ErrorHandler(res, 404, "cart not found");
    }
    let totalProducts = cart.products.length;

    res.status(200).json({
      success: true,
      message: "data retrieved successfully",
      totalCarts: totalProducts,
      // cart,
    });
  } catch (err) {
    console.log(colors.red("Error", err.message));
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
