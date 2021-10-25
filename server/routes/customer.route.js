const express = require("express");
const router = express.Router();
const verifyStaff = require("../middlewares/staff.middleware");

const {
  getAllCustomers,
  createNewCustomer,
  deleteCustomerById,
  updateCustomerById,
  getCustomerById,
} = require("../controllers/customer.controller");

router.post("/create", createNewCustomer);
router.get("/get-all", getAllCustomers);
router.delete("/delete/:id", deleteCustomerById);

module.exports = router;
