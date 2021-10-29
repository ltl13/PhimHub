const express = require("express");
const router = express.Router();

const {
  getAllStaffTypes,
  getStaffTypeById,
  createStaffType,
  updateStaffTypeById,
  deleteStaffTypeById,
} = require("../controllers/staffType.controller");

router.get("/get-all", getAllStaffTypes);
router.get("/get/:id", getStaffTypeById);
router.post("/create", createStaffType);
router.put("/update/:id", updateStaffTypeById);
router.delete("/delete/:id", deleteStaffTypeById);

module.exports = router;
