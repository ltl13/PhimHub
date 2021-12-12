const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoomById,
  deleteRoomById,
} = require('../controllers/room.controller');

router.get('/get-all', verifyToken, getAllRooms);
router.get('/get/:id', verifyToken, getRoomById);
router.post('/create', verifyToken, createRoom);
router.put('/update/:id', verifyToken, updateRoomById);
router.delete('/delete/:id', verifyToken, deleteRoomById);

module.exports = router;
