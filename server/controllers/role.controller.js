const Role = require("../models/Role");

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

const createRole = async (req, res) => {};

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
