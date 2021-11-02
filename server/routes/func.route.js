const express = require("express");
const router = express.Router();

const { createFunc } = require("../controllers/func.controller");

router.post("/create", createFunc);

module.exports = router;
