const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDb = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const CartRoutes = require("./routes/CartRoutes");
const orderProductsRoutes = require("./routes/orderProductsRoutes");
const morgan = require("morgan");
dotenv.config();

let port = process.env.PORT || 5006;

//Data base connection
connectDb();

const app = express();
// app.use(morgan("dev"));
// app.use(morgan("combined")); // Or use "dev" for simpler logs
//middlewares
// app.use(cors());
app.use(
  cors({
    origin: "*", // Allow all origins (for testing)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Middleware to parse JSON data
app.use(bodyParser.json());
// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use("/api/auth", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/order", orderProductsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "serves are live now",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
