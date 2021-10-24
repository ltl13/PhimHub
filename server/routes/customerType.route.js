const express = require("express");
const router = express.Router();
const verifyStaff = require("../middlewares/staff.middleware");

const {
  createCustomerType,
  getCustomerType,
  updateCustomerType,
  getAllCustomerTypes,
  deleteCustomerType,
} = require("../controllers/customerType.controller");

router.post("/create", createCustomerType);
router.get("/get/:id", getCustomerType);
router.put("/update/:id", updateCustomerType);
router.get("/get", getAllCustomerTypes);
router.delete("/delete/:id", deleteCustomerType);

module.exports = router;
