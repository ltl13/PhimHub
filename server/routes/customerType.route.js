const express = require("express");
const router = express.Router();

const { addCustomerType } = require("../controllers/customerType.controller");

router.post("/add", addCustomerType);

module.exports = router;
