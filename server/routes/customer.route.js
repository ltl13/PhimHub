const express = require("express");
const router = express.Router();
const verifyStaff = require("../middlewares/staff.middleware");

const {
  getAllCustomer,
  createNewCustomer,
  deleteCustomer,
  updateCustomer,
  getCustomer,
} = require("../controllers/customer.controller");

router.post("/create", createNewCustomer);
router.get("/get-all", getAllCustomer);
router.delete("/delete/:id", deleteCustomer);

module.exports = router;
