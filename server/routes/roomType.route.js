const RoomType = require('../models/RoomType');
const Room = require('../models/Room');
const { confirmAccess } = require("../shared/functions");

const getAllRoomTypes = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
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