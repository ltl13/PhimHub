const Seat = require("../models/Seat");
const { confirmAccess } = require("../shared/functions");

const getAllSeats = async (req, res) => {
  // Passed
  try {
    const allSeats = await Seat.find({ status: { $ne: 0 } }).populate({
      path: "seatType",
      select: "typeName",
    });

    return res.status(200).json({
      success: true,
      allSeats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSeatById = async (req, res) => {
  // Passed
  try {
    const seat = await Seat.findOne({
      _id: req.params.id,
      status: { $ne: 0 },
    }).populate({
      path: "seatType",
      select: "typeName",
    });

    if (!seat)
      return res.status(406).json({
        success: false,
        message: "Seat not found",
      });

    return res.status(200).json({
      success: true,
      seat,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createSeat = async (req, res) => {
  try {
    const {
      code,

      status,

      seatType,

      room,
    } = req.body;

    // Check informantion
    let checker = await Seat.findOne({
      code,
      room,
      status: { $ne: 0 },
    });
    if (checker)
      return res.status(400).json({
        success: false,
        invalid: "code",
        message: "Seats code in one room can not be duplicated",
      });

    // Create new seat
    const newSeat = new Seat({
      code,
      status,
      seatType,
      room,
      tickets: [],
    });
    newSeat.save();

    return res.status(201).json({
      success: true,
      message: "New seat has been created successfully",
      newSeat,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
