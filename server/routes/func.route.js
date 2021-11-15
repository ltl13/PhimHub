const express = require("express");
const router = express.Router();

const {
  createFunc,
  deleteFuncById,
} = require("../controllers/func.controller");

router.post("/create", createFunc);
router.delete("/delete/:id", deleteFuncById);

module.exports = router;
