const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  createCustomerType,
  getCustomerTypeById,
  updateCustomerTypeById,
  getAllCustomerTypes,
  deleteCustomerTypeById,
} = require("../controllers/customerType.controller");

router.post("/create", verifyToken, createCustomerType);
router.get("/get/:id", verifyToken, getCustomerTypeById);
router.get("/get-all", verifyToken, getAllCustomerTypes);
router.put("/update/:id", verifyToken, updateCustomerTypeById);
router.delete("/delete/:id", verifyToken, deleteCustomerTypeById);

module.exports = router;
