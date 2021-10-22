const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const {
  getAuth,
  register,
  login,
  resetPassword,
  logout,
} = require("../controllers/auth.controller");

router.get("/", verifyToken, getAuth);
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

module.exports = router;
