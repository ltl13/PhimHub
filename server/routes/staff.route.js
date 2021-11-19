const express = require('express');
const router = express.Router();

const verifyResetPasswordToken = require('../middlewares/changePassword.middleware');
const verifyToken = require('../middlewares/auth.middleware');
const {
  loginStaff,
  sendChangePasswordTokenStaff,
  resetPasswordStaff,
  getAllStaffs,
  getStaffById,
  createStaff,
  updateStaffById,
  deleteStaffById,
  getLoggedInStaff,
  changePasswordStaff,
} = require('../controllers/staff.controller');

router.put('/login', loginStaff);
router.get('/send-token', sendChangePasswordTokenStaff);
router.put('/reset-password', verifyResetPasswordToken, resetPasswordStaff);
router.get('/get-all', verifyToken, getAllStaffs);
router.get('/get/:id', verifyToken, getStaffById);
router.post('/create', createStaff);
router.put('/update/:id', verifyToken, updateStaffById);
router.delete('/delete/:id', verifyToken, deleteStaffById);
router.get('/', verifyToken, getLoggedInStaff);
router.put('/change-password', verifyToken, changePasswordStaff);

module.exports = router;
