const express = require("express");
const router = express.Router();

const {
  getAllPayments,
  getPaymentById,
  createPayment,
  refundPaymentByTicketId,
} = require("../controllers/payment.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.get("/get-all", verifyToken, getAllPayments);
router.get("/get/:id", verifyToken, getPaymentById);
router.post("/create", verifyToken, createPayment);
router.put("/refund/:id", verifyToken, refundPaymentByTicketId);

module.exports = router;
