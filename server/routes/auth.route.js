const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const {
  getAuthById,
  register,
  login,
  resetPassword,
  logout,
} = require("../controllers/auth.controller");

router.get("/get/:id", verifyToken, getAuthById);
router.post("/register", register);
router.post("/login", login);
router.put("/reset-password", resetPassword);
router.post("/logout", logout);

module.exports = router;
