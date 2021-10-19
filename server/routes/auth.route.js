const express = require("express");
const router = express.Router();
const {
  getAuth,
  register,
  login,
  resetPassword,
} = require("../controllers/auth.controller");

router.get("/", getAuth);
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);

module.exports = router;
