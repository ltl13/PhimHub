const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  createTicketType,
  getTicketTypeById,
  updateTicketTypeById,
  getAllTicketTypes,
  deleteTicketTypeById,
} = require("../controllers/ticketType.controller");

router.post("/create", verifyToken, createTicketType);
router.get("/get-all", verifyToken, getAllTicketTypes);
router.get("/get/:id", verifyToken, getTicketTypeById);
router.put("/update/:id", verifyToken, updateTicketTypeById);
router.delete("/delete/:id", verifyToken, deleteTicketTypeById);

module.exports = router;
