const Role = require("../models/Role");
const Func = require("../models/Func");

const getAllRoles = async (req, res) => {
  try {
    const allRoles = await Role.find().populate({
      path: "funcs",
      select: "funcName",
    });

    return res.status(200).json({
      success: true,
      message: "Get all roles successfully",
      allRoles,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    return res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { roleName, funcs } = req.body;

    // Check if role name has existed in database
    let checker = await Role.findOne({ roleName });
    if (checker) {
      return res.status(400).json({
        success: false,
        message: "This role has existed",
      });
    }

    // Create role
    const newRole = new Role({
      roleName,
      funcs,
    });

    // Add role to functions
    if (funcs) {
      funcs.forEach(async (func) => {
        await Function.findById(func).then((result) => {
          if (result) {
            result.roles.push(newRole._id);
            result.save();
          }
        });
      });
    }

    // Save all change and return result
    newRole.save();
    return res.status(201).json({
      success: true,
      message: "New role has been created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateFunctionsForRoleById = async (req, res) => {
  try {
    const { funcs } = req.body;

    let checker = await Role.findByIdAndUpdate(req.params.id, { funcs });
    if (!checker) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Functions for this role have been updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateRoleNameById = async (req, res) => {};

const deleteRoleById = async (req, res) => {};

module.exports = {
  getRoleById,
  getAllRoles,
  createRole,
  updateFunctionsForRoleById,
  updateRoleNameById,
  deleteRoleById,
};
