const argon2 = require("argon2");
const { confirmAccess, standardName } = require("../shared/functions");

const Room = require("../models/Room");

const getAllRooms = async (req, res) => {
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

  try {
    const allRooms = await Room.find({ deletedAt: null }).populate({
      path: "roomType",
      select: "typeName",
    });
    return res.status(200).json({
      success: true,
      allRooms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getRoomById = async (req, res) => {
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
    const room = await Room.find({
      _id: req.params.id,
      deletedAt: null,
    }).populate({
      path: "roomType",
      select: "typeName",
    });

    if (!room) {
      return res.status(406).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createRoom = async (req, res) => {
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
    const { name, roomType } = req.body;

    const standardizedName = standardName(name);

    const checker = await Room.findOne({
      name: standardizedName,
      deletedAt: null,
    });
    if (checker) {
      return res.status(400).json({
        success: false,
        invalid: "name",
        message: "This room type has existed",
      });
    }

    const newRoom = new Room({
      name: standardizedName,
      roomType,
    });
    await newRoom.save();

    return res.status(200).json({
      success: true,
      message: "New room was created successfully",
      newRoom,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

const updateRoomById = async (req, res) => {
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
    const { name, roomType } = req.body;
    const standardizedName = standardName(name);

    const room = await Room.findOne({
      _id: req.params.id,
      deletedAt: null,
      status: true,
    });

    if (!room) {
      return res.status(406).json({
        status: false,
        message: "Room not found",
      });
    }

    const checker = await Room.findOne({
      name: standardizedName,
    });
    if (checker && checker.id != room.id) {
      // room.name !== standardizedName) {
      return res.status(400).json({
        success: false,
        invalid: "name",
        message: "This room type has existed",
      });
    }

    await Room.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: standardizedName,
        roomType,
      },
      { new: true }
    ).then(async (result) => await result.save());
    // await result.save();
    return res.status(200).json({
      success: true,
      message: "Room's information has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteRoomById = async (req, res) => {
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
    const delRoom = await Room.findByIdAndUpdate(
      { _id: req.params.id },
      { deletedAt: new Date(Date.now()) },
      { new: true }
    );
    if (!delRoom) {
      return res.status(406).json({
        success: false,
        message: "Room not found",
      });
    }
    delRoom.save();
    return res.status(200).json({
      success: true,
      message: "Delete room successfully",
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
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoomById,
  deleteRoomById,
};
