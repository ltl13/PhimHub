const Func = require("../models/Func");
const mongoose = require("mongoose");

const confirmAccess = async ({ staffType, func }) => {
  try {
    const checker = await Func.findOne({ funcName: func, staffTypes: staffType });
    if (!checker) return false;
    else return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { confirmAccess };
