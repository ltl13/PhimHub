const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middlewares/admin.middleware");

const {
  createCustomerType,
  getCustomerType,
} = require("../controllers/customerType.controller");

router.post("/create", verifyAdmin, createCustomerType);
router.post("/get", verifyAdmin, getCustomerType);

module.exports = router;
