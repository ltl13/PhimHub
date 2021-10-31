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

const getSeatTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getSeatTypeById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const seatType = await SeatType.findById(req.params.id);
    if (!seatType)
      return res.status(404).json({
        success: false,
        message: "Seat type not found",
      });
    return res.status(200).json({
      success: true,
      SeatType,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createSeatType = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "createSeatType",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const { typeName } = req.body;

    // Check if this type has existed
    let checker = await SeatType.findOne({ position });
    if (checker)
      return res.status(409).json({
        success: false,
        message: "This type has existed",
      });

    // Add new type
    const newSeatType = new SeatType({
      typeName,
    });
    await newSeatType.save();
    return res.status(201).json({
      success: true,
      message: "New seat type has just been added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateSeatTypeById = async (req, res) => {
  try {
    const { typeName } = req.body;

    // Check if Seat exists in database
    const seatType = await SeatType.findById(req.params.id);
    if (!seatType) {
      return res.status(404).json({
        success: false,
        message: "Seat type not found",
      });
    }

    // Check if new type name has existed
    const checker = await SeatType.findOne({
      typeName,
    });
    console.log(seatType.typeName != typeName);
    if (checker && seatType.typeName != typeName) {
      return res.status(400).json({
        success: false,
        message: "This seat type has existed",
      });
    }

    // Update new type name
    await SeatType.findByIdAndUpdate(
      req.params.id,
      {
        typeName,
      },
      { new: true }
    ).then(async (result) => await result.save());

    // Updated successfully
    return res.status(200).json({
      success: true,
      message: "Seat type has been updated",
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
