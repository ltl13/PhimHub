const RoomType = require("../models/RoomType");
const Room = require("../models/Room");
const SeatType = require("../models/SeatType");
const { confirmAccess, standardName } = require("../shared/functions");

const { getInfoSeatType } = require("./seatType.controller");

const getAllRoomTypes = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: "CinemaRoomManagement",
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: "Not has access",
    });

  // Passed
  try {
    const allRoomTypes = await RoomType.find({ deletedAt: null }).populate({
      path: "seats",
      select: "typeName",
    });
    return res.status(200).json({
      success: true,
      allRoomTypes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getRoomTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: "CinemaRoomManagement",
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: "Not has access",
    });

  // Passed
  try {
    const roomType = await RoomType.findById(req.params.id);
    if (!roomType || !!roomType.deleteAt)
      return res.status(406).json({
        success: false,
        message: "Room type not found",
      });

    // const newSeats = await getInfoSeatType(roomType.seats);
    return res.status(200).json({
      success: true,
      roomType,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createRoomType = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: "CinemaRoomManagement",
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: "Not has access",
    });

  // Passed
  try {
    const { typeName, seats } = req.body;

    const standardizedName = standardName(typeName);

    // Check if this type has existed
    let checker = await RoomType.findOne({ typeName: standardizedName });
    if (checker)
      return res.status(409).json({
        success: false,
        invalid: "typeName",
        message: "This type has existed",
      });

    // Add new type
    const newRoomType = new RoomType({
      typeName: standardizedName,
      seats,
    });
    await newRoomType.save();
    return res.status(201).json({
      success: true,
      message: "New room type was added successfully",
      newRoomType,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateRoomTypeById = async (req, res) => {
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: "CinemaRoomManagement",
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: "Not has access",
    });

  try {
    const { typeName, seats } = req.body;
    const standardizedName = standardName(typeName);

    // Check if Room exists in database
    const roomType = await RoomType.findById(req.params.id);
    if (!roomType) {
      return res.status(406).json({
        success: false,
        message: "Room type not found",
      });
    }

    // Check if new type name has existed
    const checker = await RoomType.findOne({
      typeName: standardizedName,
    });
    if (checker && roomType.typeName !== standardizedName) {
      return res.status(400).json({
        success: false,
        invalid: "typeName",
        message: "This room type has existed",
      });
    }

    // Update new type name
    await RoomType.findByIdAndUpdate(
      req.params.id,
      {
        typeName: standardizedName,
        seats,
      },
      { new: true }
    ).then(async (result) => await result.save());

    // Updated successfully
    return res.status(200).json({
      success: true,
      message: "Room type has been updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteRoomTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: "CinemaRoomManagement",
  });

  if (!confirm)
    return res.status(400).json({
      success: false,
      message: "Not has access",
    });

  // Passed
  try {
    // Check if there are still Rooms of this type
    const roomChecker = await Room.findOne({
      RoomType: req.params.id,
      status: true,
    });
    if (roomChecker) {
      return res.status(406).json({
        success: false,
        message: "Can not delete because there are still rooms of this type",
      });
    }

    // Delete Room type
    const deleteRoomType = await RoomType.findByIdAndDelete(req.params.id);
    if (!deleteRoomType) {
      return res.status(406).json({
        success: false,
        message: "Room type not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Delete room type successfully",
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
  getAllRoomTypes,
  getRoomTypeById,
  createRoomType,
  updateRoomTypeById,
  deleteRoomTypeById,
};
