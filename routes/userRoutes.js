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
router.get("/test", (req, res, next) => {
  res.status(200).json({ name: "test", success: true });
});

module.exports = router;
