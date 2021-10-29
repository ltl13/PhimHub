const argon2 = require("argon2");

const Account = require("../models/Account");
const Staff = require("../models/Staff");
const { confirmAccess } = require("../shared/functions");

const getAllStaffs = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllStaffs",
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
    func: "getStaffById",
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
    func: "createStaff",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const {
      staffType,
      username,
      password,
      phoneNumber,
      email,
      name,
      sex,
      dateOfBirth,
      identityNumber,
      salary,
      role,
    } = req.body;

    // Check if email/phone number/identity number has been used by another staff before
    let checker = await Staff.findOne({ phoneNumber, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: "phoneNumber",
        message: "This phone number has been used by another staff",
      });
    }

    checker = await Staff.findOne({ identityNumber, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: "identityNumber",
        message: "This identity number has been used by another staff",
      });
    }

    checker = await Staff.findOne({ email, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: "email",
        message: "This email has been used by another staff",
      });
    }

    // Create a new account for this staff
    const hashedPassword = await argon2.hash(password);
    const newAccount = new Account({
      username,
      password: hashedPassword,
      role,
    });

    // Create new staff
    const newStaff = new Customer({
      staffType,
      phoneNumber,
      email,
      name,
      sex,
      dateOfBirth: new Date(dateOfBirth.concat("T00:00:20Z")),
      account: newAccount._id,
      username,
      identityNumber,
      salary,
    });
    await newAccount.save();
    await newStaff.save();

    return res.status(201).json({
      success: true,
      message: "New staff was created successfully",
    });
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
