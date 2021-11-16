const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const {
  getAllCustomers,
  createCustomer,
  loginCustomer,
  resetPasswordCustomer,
  registerCustomer,
  deleteCustomerById,
  updateCustomerById,
  getCustomerById,
} = require("../controllers/customer.controller");

router.get("/get-all", verifyToken, getAllCustomers);
router.get("/get/:id", verifyToken, getCustomerById);
router.post("/create", verifyToken, createCustomer);
router.post("/register", registerCustomer);
router.put("/login", loginCustomer);
router.put("/reset-password", resetPasswordCustomer);
router.put("/update/:id", verifyToken, updateCustomerById);
router.delete("/delete/:id", verifyToken, deleteCustomerById);

module.exports = router;
