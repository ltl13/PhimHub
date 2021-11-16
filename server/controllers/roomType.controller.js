const RoomType = require("../models/RoomType");
const Room = require("../models/Room");
const { confirmAccess } = require("../shared/functions");

const getAllRoomTypes = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffType,
    func: "getAllRoomTypes",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allRoomTypes = await RoomType.find();
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
    staffType: req.body.staffType,
    func: "getRoomTypeById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const roomType = await RoomType.findById(req.params.id);
    if (!roomType)
      return res.status(406).json({
        success: false,
        message: "Room type not found",
      });
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
    staffType: req.body.staffType,
    func: "createRoomType",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const { typeName } = req.body;

    // Check if this type has existed
    let checker = await RoomType.findOne({ typeName });
    if (checker)
      return res.status(409).json({
        success: false,
        message: "This type has existed",
      });

    // Add new type
    const newRoomType = new RoomType({
      typeName,
    });
    await newRoomType.save();
    return res.status(201).json({
      success: true,
      message: "New room type was added successfully",
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
  try {
    const { typeName } = req.body;

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
      typeName,
    });
    if (checker && roomType.typeName != typeName) {
      return res.status(400).json({
        success: false,
        message: "This room type has existed",
      });
    }

    // Update new type name
    await RoomType.findByIdAndUpdate(
      req.params.id,
      {
        typeName,
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
    staffType: req.body.staffType,
    func: "deleteRoomTypeById",
  });
  if (!confirm) return res.redirect("back");

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
