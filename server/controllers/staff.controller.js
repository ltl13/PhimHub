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
      select: "position",
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
      select: "position",
    });
    if (!staff)
      return res.status(406).json({
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
    const newStaff = new Staff({
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
    const {
      staffType,
      phoneNumber,
      email,
      name,
      sex,
      dateOfBirth,
      identityNumber,
      salary,
      role,
    } = req.body;

    // Check if this staff exists
    const staff = await Staff.findOne({
      _id: req.params.id,
      status: true,
    });
    if (!staff)
      return res.status(406).json({
        status: false,
        message: "Staff not found",
      });

    // Check if email or phone number doesn't change
    // Check if the email/phone number/identify number has been used by another staff
    let checker = await Staff.findOne({ phoneNumber, status: true });
    if (checker && phoneNumber !== staff.phoneNumber) {
      return res.status(400).json({
        success: false,
        invalid: "phoneNumber",
        message: "This phone number has been used by another staff",
      });
    }
    checker = await Staff.findOne({ email, status: true });
    if (checker && email !== staff.email) {
      return res.status(400).json({
        success: false,
        invalid: "email",
        message: "This email has been used by another staff",
      });
    }
    checker = await Staff.findOne({ identityNumber, status: true });
    if (checker && identityNumber !== staff.identityNumber) {
      return res.status(400).json({
        success: false,
        invalid: "identityNumber",
        message: "This identity number has been used by another staff",
      });
    }

    // Update staff's information
    await Staff.findOneAndUpdate(
      { _id: req.params.id, status: true },
      {
        staffType,
        phoneNumber,
        email,
        name,
        sex,
        identityNumber,
        salary,
        role,
        dateOfBirth: new Date(dateOfBirth.concat("T00:00:10Z")),
      },
      { new: true }
    ).then((result) => result.save());
    return res.status(200).json({
      success: true,
      message: "Staff's information has been updated successfully",
    });
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
    // Delete customer
    const deleteStaff = await Staff.findOneAndUpdate(
      { _id: req.params.id, status: true },
      { status: false },
      { new: true }
    );
    if (!deleteStaff) {
      return res.status(406).json({
        success: false,
        message: "Staff not found",
      });
    }

    // Delete account goes with that customer
    let checker = await Account.findByIdAndDelete(deleteStaff.account);
    if (!checker) {
      return res.status(406).json({
        success: false,
        message:
          "Found the staff but not found the account, maybe this staff was deleted",
      });
    }
    deleteStaff.save();

    return res.status(200).json({
      success: true,
      message: "Delete staff successfully",
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
  getAllStaffs,
  getStaffById,
  createStaff,
  updateStaffById,
  deleteStaffById,
};
