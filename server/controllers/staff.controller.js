const argon2 = require("argon2");

const Account = require("../models/Account");
const Staff = require("../models/Staff");
const { confirmAccess } = require("../shared/functions");

const getAllStaffs = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllCustomers",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allStaffs = await Staff.find({ status: true }).populate({
      path: "staffType",
      select: "typeName",
    });
    return res.status(200).json({
      success: true,
      allStaffs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStaffById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllCustomers",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const staff = await Staff.findById(req.params.id).populate({
      path: "staffType",
      select: "typeName",
    });
    if (!staff)
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    return res.status(200).json({
      success: true,
      staff,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createStaff = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllCustomers",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateStaffById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllCustomers",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteStaffById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllCustomers",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllStaffs,
  getStaffById,
  createStaff,
  updateStaffById,
  deleteStaffById,
};
