const express = require("express");
const router = express.Router();

//const verifyToken = require("../middlewares/auth.middleware");
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoomById,
  deleteRoomById,
} = require("../controllers/room.controller");

router.get("/get-all", getAllRooms);
router.get("/get/:id", getRoomById);
router.post("/create", createRoom);
router.put("/update/:id", updateRoomById);
router.delete("/delete/:id", deleteRoomById);

module.exports = router;