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
    const role = await Role.findById(req.params.id).populate({
      path: "funcs",
      select: "funcName",
    });

    if (!role) {
      return res.status(406).json({
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
        await Func.findById(func).then(async (result) => {
          if (result) {
            result.roles.push(newRole._id);
            await result.save();
          }
        });
      });
    }

    // Save all change and return result
    await newRole.save();
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
    const checker = await Role.findById(req.params.id);
    if (!checker)
      return res.status(406).json({
        success: false,
        message: "Role not found",
      });

    // Delete all connections of this role with funcs before updating
    if (checker.funcs) {
      checker.funcs.forEach(async (func) => {
        const findFunc = await Func.findById(func);
        if (findFunc) {
          const listRoleUpdate = findFunc.roles;
          listRoleUpdate.splice(listRoleUpdate.indexOf(checker._id));
          await Func.findByIdAndUpdate(
            func,
            { roles: listRoleUpdate },
            { new: true }
          ).then(async (result) => await result.save());
        }
      });
    }

    // Update role's info
    const updateRole = await Role.findByIdAndUpdate(req.params.id, {
      roleName,
      funcs,
    });
    await updateRole.save();

    // Add connections of this role with funcs
    if (funcs) {
      funcs.forEach(async (func) => {
        const updateFunc = await Func.findById(func);
        if (updateFunc) {
          await Func.findByIdAndUpdate(func, {
            roles: [...updateFunc.roles, updateRole._id],
          }).then(async (result) => await result.save());
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
    const checker = await Account.findOne({ role: req.params.id });
    if (checker) {
      return res.status(409).json({
        success: false,
        message: "Can not delete because there are still accounts of this role",
      });
    }

    // Delete role
    const deleteRole = await Role.findByIdAndDelete(req.params.id);
    if (!deleteRole) {
      return res.status(406).json({
        success: false,
        message: "Role not found",
      });
    }

    // Delete role's id in funcs
    if (deleteRole.funcs) {
      deleteRole.funcs.forEach(async (func) => {
        const findFunc = await Func.findById(func);
        if (findFunc) {
          const listRoleUpdate = findFunc.roles;
          listRoleUpdate.splice(listRoleUpdate.indexOf(deleteRole._id));
          await Func.findByIdAndUpdate(
            func,
            { roles: listRoleUpdate },
            { new: true }
          ).then(async (result) => await result.save());
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role was deleted successfully",
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
