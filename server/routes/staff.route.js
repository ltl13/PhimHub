const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const {
  loginStaff,
  resetPasswordStaff,
  getAllStaffs,
  getStaffById,
  createStaff,
  updateStaffById,
  deleteStaffById,
  getLoggedInStaff,
} = require('../controllers/staff.controller');

router.post('/login', loginStaff);
router.put('/reset-password', resetPasswordStaff);
router.get('/get-all', verifyToken, getAllStaffs);
router.get('/get/:id', verifyToken, getStaffById);
router.post('/create', createStaff);
router.put('/update/:id', verifyToken, updateStaffById);
router.delete('/delete/:id', verifyToken, deleteStaffById);
router.get('/', verifyToken, getLoggedInStaff);

module.exports = router;
