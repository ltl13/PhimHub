const Func = require("../models/Func");
const mongoose = require("mongoose");

const confirmAccess = async ({ role, func }) => {
  try {
    const checker = await Func.findOne({ funcName: func, roles: role });
    if (!checker) return false;
    else return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { confirmAccess };
