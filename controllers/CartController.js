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
    console.log("cart", cart);

    let products = await Products.findById(productId);

    console.log("products", products);
    if (!products) {
      return ErrorHandler(res, 404, "product not found in Products");
    }

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        userId,
        products: [
          {
            productId,
            quantity,
            price: products.price,
            category: products.category,
            description: products.description,
            photos: products.photos,
          },
        ],
        totalAmount: quantity * products.price,
      });
    } else {
      // Check if product already exists in the cart
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new product
        cart.products.push({
          productId,
          quantity,
          price: products.price,
          category: products.category,
          description: products.description,
          photos: products.photos,
        });
      }

      // Update total amount
      cart.totalAmount += quantity * products.price;
    }

    await cart.save();

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
      return ErrorHandler(res, 404, "cart not found");
    }

    const singleProduct = cart?.products?.find(
      (product) => product?.productId?._id?.toString() === productId?.toString()
    );
    // console.log("singleProduct", singleProduct);
    if (!singleProduct) {
      return ErrorHandler(res, 404, "single product not found");
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

    if (!productId || !quantity) {
      return ErrorHandler(res, 404, "product Id, quantity  required");
    }
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return ErrorHandler(res, 404, "cart not found");
    }

    const productIndex = cart.products?.findIndex(
      (product) => product?.productId.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      cart.totalAmount = cart.products.reduce((acc, item) => {
        return (acc = acc + item.price * item.quantity);
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

    if (!cart) {
      return ErrorHandler(res, 404, "cart not found");
    }

    const productIndex = cart.products?.findIndex(
      (product) => product?.productId.toString() === productId
    );

    if (productIndex > -1) {
      // Remove the product from the cart
      cart.products.splice(productIndex, 1); // Removes the product at the index

      cart.totalAmount = cart.products.reduce((acc, item) => {
        return (acc = acc + item.price * item.quantity);
      }, 0);
    } else {
      return ErrorHandler(res, 404, "cart item not deleted");
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "cart item deleted successfully",
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
