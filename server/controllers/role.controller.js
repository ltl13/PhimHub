const Role = require("../models/Role");
const Function = require("../models/Function");

const getAllRoles = async (req, res) => {
  try {
    const allRoles = await Role.find().populate({
      path: "functions",
      select: "functionName",
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
    const { roleName, functions } = req.body;

    // Check if role name has existed in database
    await Role.findOne({ roleName }).then((result) => {
      if (result) {
        return res.status(400).json({
          success: false,
          message: "This role has existed",
        });
      }
    });

    // Create role
    const newRole = new Role({
      roleName,
      functions,
    });

    // Add role to functions
    functions.forEach((func) => {
      await Function.findById(func).then((result) => {
        if (result) {
          result.roles.push(newRole._id);
          result.save();
        }
      });
    });

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

const updateFunctionsForRoleById = async (req, res) => {};

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
