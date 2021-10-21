const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middlewares/admin.middleware");

const { addCustomerType } = require("../controllers/customerType.controller");

router.post("/add", verifyAdmin, addCustomerType);

module.exports = router;
