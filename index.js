const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/database");
const userRoutes = require("./routes/userRoutes");
dotenv.config();

let port = process.env.PORT || 5006;

//Data base connection
connectDb();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "serves are live now",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
