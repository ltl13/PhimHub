const express = require("express");
const router = express.Router();
const {
  getAuth,
  registerNewAccount,
} = require("../controllers/auth.controller");

router.get("/", getAuth);
router.post("/register", registerNewAccount);

module.exports = router;
