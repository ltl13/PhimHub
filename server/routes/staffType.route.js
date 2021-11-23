const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const {
  getAllStaffTypes,
  getStaffTypeById,
  createStaffType,
  updateStaffTypeById,
  deleteStaffTypeById,
} = require('../controllers/staffType.controller');

router.get('/get-all', verifyToken, getAllStaffTypes);
router.get('/get/:id', verifyToken, getStaffTypeById);
router.post('/create', verifyToken, createStaffType);
router.put('/update/:id', verifyToken, updateStaffTypeById);
router.delete('/delete/:id', verifyToken, deleteStaffTypeById);

module.exports = router;
