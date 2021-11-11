const express = require("express");
const router = express.Router();

//const verifyToken = require("../middlewares/auth.middleware");
const {
  getAllSeats,
  getSeatById,
  createSeat,
  updateSeatById,
  deleteSeatById,
} = require("../controllers/seat.controller");

router.get("/get-all", getAllSeats);
router.get("/get/:id", getSeatById);
router.post("/create", createSeat);
router.put("/update/:id", updateSeatById);
router.delete("/delete/:id", deleteSeatById);

module.exports = router;
