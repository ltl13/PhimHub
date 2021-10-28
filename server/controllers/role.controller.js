const Role = require("../models/Role");
const Func = require("../models/Func");
const Account = require("../models/Account");

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

const updateRoleById = async (req, res) => {
  try {
    const { roleName, funcs } = req.body;

    // Check if role exists
    let checker = await Role.findById(req.params.id);
    if (!checker)
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });

    // Delete all connections of this role with funcs before updating
    if (checker.funcs) {
      checker.funcs.forEach(async (func) => {
        const checkFunc = await Func.findById(func);
        if (checkFunc) {
          await Func.findByIdAndUpdate(func, {
            roles: checkFunc.roles.filter((role) => role !== checker._id),
          }).then((result) => result.save());
        }
      });
    }

    // Update role's info
    const updateRole = await Role.findByIdAndUpdate(req.params.id, {
      roleName,
      funcs,
    });
    updateRole.save();

    // Add connections of this role with funcs
    if (funcs) {
      funcs.forEach(async (func) => {
        const updateFunc = await Func.findById(func);
        if (updateFunc) {
          await Func.findByIdAndUpdate(func, {
            roles: [...updateFunc.roles, updateRole._id],
          }).then((result) => result.save());
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: "Update role successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteRoleById = async (req, res) => {
  try {
    // Check if there are still accounts of this role
    let checker = await Account.findOne({ role: req.params.id });
    if (checker) {
      return res.status(406).json({
        success: false,
        message: "Can not delete because there are still accounts of this role",
      });
    }

    // Delete role
    checker = await Role.findByIdAndDelete(req.params.id);
    if (!checker) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Delete role's id in funcs
    if (checker.funcs) {
      checker.funcs.forEach(async (func) => {
        const findFunc = await Func.findById(func);
        const listRoleUpdate = findFunc.roles.filter(
          (role) => role !== checker._id
        );
        await Func.findByIdAndUpdate(
          func,
          { roles: listRoleUpdate },
          { new: true }
        ).then((result) => result.save());
      });
    }

    return res.status(204).json({
      success: true,
      message: "Role has been deleted successfully",
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
  getRoleById,
  getAllRoles,
  createRole,
  updateRoleById,
  deleteRoleById,
};
