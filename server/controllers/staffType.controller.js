const { confirmAccess } = require("../shared/functions");
const StaffType = require("../models/StaffType");
const Staff = require("../models/Staff");
const Func = require("../models/Func");

const getAllStaffTypes = async (req, res) => {
  // Check if user can access this route
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "getAllStaffTypes",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allStaffTypes = await StaffType.find().populate({
      path: "funcs",
      select: "funcName",
    });
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
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "getStaffTypeById",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const staffType = await StaffType.findById(req.params.id).populate({
      path: "funcs",
      select: "funcName",
    });
    if (!staffType)
      return res.status(406).json({
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
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "createStaffType",
  // });
  // if (!confirm) return res.redirect("back");

  // Passed
  try {
    const { typeName } = req.body;

    // Check if this position has existed
    const checker = await StaffType.findOne({ typeName });
    if (checker)
      return res.status(409).json({
        success: false,
        message: "This type name has existed",
      });

    // Add new position
    const newStaffType = new StaffType({
      typeName,
      funcs: [],
    });
    await newStaffType.save();
    return res.status(201).json({
      success: true,
      message: "New staff type has just been added",
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
    typeName: req.body.staffType,
    func: "updateStaffTypeById",
  });
  if (!confirm) return res.redirect("back");

  try {
    const { typeName, funcs } = req.body;

    // Check if this staff type exists
    const checkStaffType = await StaffType.findById(req.params.id);
    if (!checkStaffType)
      return res.status(406).json({
        success: false,
        message: "Staff type not found",
      });

    // Check if this type name has existed
    const checkTypeName = await StaffType.findOne({
      _id: { $ne: req.params.id },
      typeName,
    });
    if (checkTypeName)
      return res.status(400).json({
        success: false,
        message: "This type name has existed",
      });

    // Delete all connections of this staff type with funcs before updating
    if (checkStaffType.funcs.length > 0) {
      checkStaffType.funcs.forEach(async (func) => {
        const findFunc = await Func.findById(func);
        if (findFunc) {
          const listStaffTypeUpdate = findFunc.staffTypes;
          listStaffTypeUpdate.splice(
            listStaffTypeUpdate.indexOf(checkStaffType._id)
          );
          await Func.findByIdAndUpdate(
            func,
            { staffTypes: listStaffTypeUpdate },
            { new: true }
          ).then(async (result) => await result.save());
        }
      });
    }

    // All good, update staff type's info
    const updateStaffType = await StaffType.findByIdAndUpdate(
      req.params.id,
      { typeName, funcs },
      { new: true }
    );
    await updateStaffType.save();

    // Add connection of this staff type with func
    if (funcs.length > 0) {
      funcs.forEach(async (func) => {
        const updateFunc = await Func.findById(func);
        if (updateFunc) {
          await Func.findByIdAndUpdate(func, {
            staffTypes: [...updateFunc.staffTypes, updateStaffType._id],
          }).then(async (result) => await result.save());
        }
      });
    }

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
  // const confirm = await confirmAccess({
  //   staffType: req.body.staffType,
  //   func: "deleteStaffTypeById",
  // });
  // if (!confirm) return res.redirect("back");

  try {
    // Check if this staff type exists
    const checkeStaffType = await StaffType.findById(req.params.id);
    if (!checkeStaffType)
      return res.status(406).json({
        success: false,
        message: "Staff type not found",
      });

    // Check if this staff type is in connection with staffs
    const checkStaff = await Staff.findOne({
      staffType: req.params.id,
      status: true,
    });
    if (checkStaff)
      return res.status(409).json({
        success: false,
        message: "There is still staffs of this type so it can not be deleted",
      });

    // All good, delete staff type
    const deleteStaffType = await StaffType.findByIdAndDelete(req.params.id);

    // Delete staff type in func
    if (deleteStaffType.funcs.length > 0) {
      deleteStaffType.funcs.forEach(async (func) => {
        const findFunc = await Func.findById(func);
        if (findFunc) {
          const listStaffTypeUpdate = findFunc.roles;
          listStaffTypeUpdate.splice(
            listStaffTypeUpdate.indexOf(deleteStaffType._id)
          );
          await Func.findByIdAndUpdate(
            func,
            { staffType: listStaffTypeUpdate },
            { new: true }
          ).then(async (result) => await result.save());
        }
      });
    }

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
