const express = require("express");
const router = express.Router();
const verifyStaff = require("../middlewares/staff.middleware");

const {
  createCustomerType,
  getCustomerTypeById,
  updateCustomerTypeById,
  getAllCustomerTypes,
  deleteCustomerTypeById,
} = require("../controllers/customerType.controller");

router.post("/create", createCustomerType);
router.get("/get/:id", getCustomerTypeById);
router.put("/update/:id", updateCustomerTypeById);
router.get("/get-all", getAllCustomerTypes);
router.delete("/delete/:id", deleteCustomerTypeById);

module.exports = router;
