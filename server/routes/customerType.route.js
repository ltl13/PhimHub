const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middlewares/admin.middleware");

const {
  createCustomerType,
  getCustomerType,
  updateCustomerType,
  getAllCustomerTypes,
} = require("../controllers/customerType.controller");

router.post("/create", verifyAdmin, createCustomerType);
router.get("/get/:id", verifyAdmin, getCustomerType);
router.put("/update/:id", verifyAdmin, updateCustomerType);
router.get("/get", verifyAdmin, getAllCustomerTypes);

module.exports = router;
