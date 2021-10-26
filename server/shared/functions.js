const Account = require("../models/Account");
const Role = require("../models/Role");
const Func = require("../models/Func");

const confirmAccess = async ({ role, func }) => {
  try {
    const checker = await Func.findOne({ funcName: func, roles: role });
    if (!checker) {
      return {
        status: 403,
        success: false,
        message: "You are not allowed to access this content",
      };
    }
    return {
      status: 202,
      success: true,
      message: "Confirmed",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      success: false,
      message: "Internal server error",
    };
  }
};

module.exports = { confirmAccess };
