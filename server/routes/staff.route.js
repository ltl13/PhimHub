const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  getAllStaffs,
  getStaffById,
  createStaff,
  updateStaffById,
  deleteStaffById,
} = require("../controllers/staff.controller");

router.get("/get-all", verifyToken, getAllStaffs);
router.get("/get/:id", verifyToken, getStaffById);
router.post("/create", verifyToken, createStaff);
router.put("/update/:id", verifyToken, updateStaffById);
router.delete("/delete/:id", verifyToken, deleteStaffById);

module.exports = router;
