const Func = require("../models/Func");
const Role = require("../models/Role");

const createFunc = async (req, res) => {
  try {
    const { funcName, roles, displayName } = req.body;

    // Check if funcName has already existed in database
    let checker = await Func.findOne({ funcName });
    if (checker)
      return res.status(404).json({
        success: false,
        message: "This func has already existed",
      });

    // Create func
    const newFunc = new Func({ funcName, roles, displayName });

    // Add func to roles
    if (roles) {
      roles.forEach(async (role) => {
        await Role.findById(role).then((result) => {
          if (result) {
            result.funcs.push(newFunc._id);
            result.save();
          }
        });
      });
    }
    newFunc.save();

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

module.exports = { createFunc };
