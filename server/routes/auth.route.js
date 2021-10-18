const express = require("express");
const router = express.Router();
const {
  getAuth,
  registerNewAccount,
  login,
} = require("../controllers/auth.controller");

router.get("/", getAuth);
router.post("/register", registerNewAccount);
router.post("/login", login);

module.exports = router;
