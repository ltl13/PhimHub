const Func = require("../models/Func");
const Role = require("../models/Role");

const createFunc = async (req, res) => {
  try {
    const { funcName, roles, displayName } = req.body;

    // Check if funcName has already existed in database
    let checker = await Func.findOne({ funcName });
    if (checker)
      return res.status(406).json({
        success: false,
        message: "This func has already existed",
      });

    // Create func
    const newFunc = new Func({ funcName, roles, displayName });

    // Add func to roles
    if (roles) {
      roles.forEach(async (role) => {
        await Role.findById(role).then(async (result) => {
          if (result) {
            result.funcs.push(newFunc._id);
            await result.save();
          }
        });
      });
    }
    await newFunc.save();

    return res.status(201).json({
      success: true,
      message: "New func has been added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteFuncById = async (req, res) => {
  try {
    const deleteFunc = await Func.findByIdAndDelete(req.params.id);
    if (!deleteFunc)
      return res.status(406).json({
        success: false,
        message: "Func not found",
      });

    if (deleteFunc.roles) {
      deleteFunc.roles.forEach(async (role) => {
        const findRole = await Role.findById(role);
        const listFuncUpdate = findRole.funcs;
        listFuncUpdate.splice(listFuncUpdate.indexOf(deleteFunc._id), 1);
        await Role.findByIdAndUpdate(
          role,
          { funcs: listFuncUpdate },
          { new: true }
        ).then(async (result) => await result.save());
      });
    }

    return res.status(200).json({
      success: true,
      message: "Func was deleted successfully",
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
  createFunc,
  deleteFuncById,
};
