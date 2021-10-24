const express = require("express");
const router = express.Router();
const verifyStaff = require("../middlewares/staff.middleware");

const {
  createCustomerType,
  getCustomerType,
  updateCustomerType,
  getAllCustomerTypes,
} = require("../controllers/customerType.controller");

router.post("/create", verifyStaff, createCustomerType);
router.get("/get/:id", verifyStaff, getCustomerType);
router.put("/update/:id", verifyStaff, updateCustomerType);
router.get("/get", verifyStaff, getAllCustomerTypes);

module.exports = router;
