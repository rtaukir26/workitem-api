const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

let port = process.env.PORT || 5006;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "serves are live now",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
