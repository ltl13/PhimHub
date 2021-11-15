const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const {
  getAuthById,
  register,
  login,
  resetPassword,
  logout,
  getLoggedInStaff,
} = require('../controllers/auth.controller');
const { verify } = require('argon2');

router.get('/get/:id', verifyToken, getAuthById);
router.post('/register', register);
router.post('/login', login);
router.put('/reset-password', resetPassword);
router.post('/logout', logout);
router.get('/get-staff', verifyToken, getLoggedInStaff);

module.exports = router;
