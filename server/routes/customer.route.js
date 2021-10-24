const express = require("express");
const router = express.Router();
const verifyStaff = require("../middlewares/staff.middleware");

const {
  getAllCustomer,
  createNewCustomer,
} = require("../controllers/customer.controller");

router.post("/create", createNewCustomer);
router.get("/get-all", getAllCustomer);

module.exports = router;
