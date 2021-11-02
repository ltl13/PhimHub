const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const {
  createSeatType,
  getSeatTypeById,
  updateSeatTypeById,
  getAllSeatTypes,
  deleteSeatTypeById,
} = require("../controllers/seatType.controller");

router.post("/create", verifyToken, createSeatType);
router.get("/get-all", verifyToken, getAllSeatTypes);
router.get("/get/:id", verifyToken, getSeatTypeById);
router.put("/update/:id", verifyToken, updateSeatTypeById);
router.delete("/delete/:id", verifyToken, deleteSeatTypeById);

module.exports = router;
