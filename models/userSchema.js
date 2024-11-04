const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, trim: true, select: false }, //in populate password will not come
  confirm_password: { type: String, required: true, trim: true, select: false },
});

module.exports = mongoose.model("User", userSchema);
