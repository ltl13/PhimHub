const Func = require("../models/Func");
const StaffType = require("../models/StaffType");

const createFunc = async (req, res) => {
  try {
    const { funcName, staffTypes, displayName } = req.body;

    // Check if funcName has already existed in database
    let checker = await Func.findOne({ funcName });
    if (checker)
      return res.status(406).json({
        success: false,
        message: "This func has already existed",
      });

    // Create func
    const newFunc = new Func({ funcName, staffTypes, displayName });

    // Add func to staff types
    if (staffTypes) {
      staffTypes.forEach(async (staffType) => {
        await StaffType.findById(staffType).then(async (result) => {
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

    if (deleteFunc.staffTypes) {
      deleteFunc.staffTypes.forEach(async (staffType) => {
        const findStaffType = await StaffType.findById(staffType);
        const listFuncUpdate = findStaffType.funcs;
        listFuncUpdate.splice(listFuncUpdate.indexOf(deleteFunc._id), 1);
        await staffType.findByIdAndUpdate(
          staffType,
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
