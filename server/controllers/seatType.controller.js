const SeatType = require("../models/SeatType");
const Seat = require("../models/Seat");
const { confirmAccess } = require("../shared/functions");

const getAllSeatTypes = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllSeatTypes",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allSeatTypes = await SeatType.find();
    return res.status(200).json({
      success: true,
      allSeatTypes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllSeatTypes,
  getSeatTypeById,
  createSeatType,
  updateSeatTypeById,
  deleteSeatTypeById,
};
