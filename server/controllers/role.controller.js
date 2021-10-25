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

const getRole = async (req, res) => {};

const createRole = async (req, res) => {};

const updateFunctionsForRole = async (req, res) => {};

const updateRoleName = async (req, res) => {};

const deleteRole = async (req, res) => {};

module.exports = {
  getRole,
  getAllRoles,
  createRole,
  updateFunctionsForRole,
  updateRoleName,
  deleteRole,
};
