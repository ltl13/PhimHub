const express = require("express");
const router = express.Router();

const {
  getAllTickets,
  getTicketById,
  createTicket,
} = require("../controllers/ticket.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.get("/get-all", verifyToken, getAllTickets);
router.get("/get/:id", verifyToken, getTicketById);

module.exports = router;
