const express = require("express");
const {
  register,
  userLogIn,
  userLogout,
  getUserInfo,
} = require("../controllers/userController");
const isAuthorized = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", userLogIn);
router.get("/profile", isAuthorized, getUserInfo);
router.get("/logout", isAuthorized, userLogout);

module.exports = router;
