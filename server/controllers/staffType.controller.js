const StaffType = require("../models/StaffType");
const Staff = require("../models/Staff");
const { confirmAccess } = require("../shared/functions");

const getAllStaffTypes = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllStaffTypes",
  });
  if (!confirm) return res.redirect("back");

  try {
    const allStaffTypes = await StaffType.find();
    return res.status(200).json({
      success: true,
      allStaffTypes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStaffTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getStaffTypeById",
  });
  if (!confirm) return res.redirect("back");

  try {
    const staffType = await StaffType.findById(req.params.id);
    if (!staffType)
      return res.status(404).json({
        success: false,
        message: "Staff type not found",
      });
    return res.status(200).json({
      success: true,
      staffType,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createStaffType = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "createStaffType",
  });
  if (!confirm) return res.redirect("back");

  try {
    const { position } = req.body;

    // Check if this position has existed
    let checker = await StaffType.findOne({ position });
    if (position)
      return res.status(409).json({
        success: false,
        message: "This position has existed",
      });

    // Add new position
    const newStaffType = new StaffType({
      position,
    });
    await newStaffType.save();
    return res.status(201).json({
      success: true,
      message: "New customer type has just been added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateStaffTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "updateStaffTypeById",
  });
  if (!confirm) return res.redirect("back");

  try {
    const { position } = req.body;

    // Check if this staff type exists
    let checker = await StaffType.findById(req.params.id);
    if (!checker)
      return res.status(404).json({
        success: false,
        message: "Staff type not found",
      });

    // Check if this position has existed
    checker = await StaffType.findOne({ position });
    if (checker)
      return res.status(400).json({
        success: false,
        message: "This position has existed",
      });

    // All good, update staff type's info
    await StaffType.findByIdAndUpdate(req.params.id, { position }).then(
      (result) => result.save()
    );

    return res.status(201).json({
      success: true,
      message: "Staff type has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteStaffTypeById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "deleteStaffTypeById",
  });
  if (!confirm) return res.redirect("back");

  try {
    // Check if this staff type exists
    let checker = await StaffType.findById(req.params.id);
    if (!checker)
      return res.status(404).json({
        success: false,
        message: "Staff type not found",
      });

    // Check if this staff type is in connection with staffs
    checker = await Staff.findOne({ staffType: req.params.id });
    if (checker)
      return res.status(409).json({
        success: false,
        message: "There is still staffs of this type so it can not be deleted",
      });

    // All good, delete staff type
    await StaffType.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Staff type was deleted successfully",
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
  getAllStaffTypes,
  getStaffTypeById,
  createStaffType,
  updateStaffTypeById,
  deleteStaffTypeById,
};
