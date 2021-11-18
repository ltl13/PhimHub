const express = require('express');
const router = express.Router();

const verifyChangePasswordToken = require('../middlewares/changePassword.middleware');
const verifyToken = require('../middlewares/auth.middleware');
const {
  loginStaff,
  sendChangePasswordTokenStaff,
  changePasswordStaff,
  getAllStaffs,
  getStaffById,
  createStaff,
  updateStaffById,
  deleteStaffById,
  getLoggedInStaff,
} = require('../controllers/staff.controller');

router.put('/login', loginStaff);
router.get('/send-token', sendChangePasswordTokenStaff);
router.put('/change-password', verifyChangePasswordToken, changePasswordStaff);
router.get('/get-all', verifyToken, getAllStaffs);
router.get('/get/:id', verifyToken, getStaffById);
router.post('/create', createStaff);
router.put('/update/:id', verifyToken, updateStaffById);
router.delete('/delete/:id', verifyToken, deleteStaffById);
router.get('/', verifyToken, getLoggedInStaff);

module.exports = router;
