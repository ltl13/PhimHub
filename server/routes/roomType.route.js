const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  createRoomType,
  getRoomTypeById,
  updateRoomTypeById,
  getAllRoomTypes,
  deleteRoomTypeById,
} = require("../controllers/roomType.controller");

router.post("/create", verifyToken, createRoomType);
router.get("/get-all", verifyToken, getAllRoomTypes);
router.get("/get/:id", verifyToken, getRoomTypeById);
router.put("/update/:id", verifyToken, updateRoomTypeById);
router.delete("/delete/:id", verifyToken, deleteRoomTypeById);

module.exports = router;
