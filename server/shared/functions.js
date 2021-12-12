const Func = require('../models/Func');
const mongoose = require('mongoose');

const confirmAccess = async ({ staffType, func }) => {
  try {
    const checker = await Func.findOne({
      funcName: func,
    });

    if (checker && checker.staffTypes.indexOf(staffType) !== -1) return true;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

function removeAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function standardName(str) {
  const convertToArray = str
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ');
  const result = convertToArray.map(function (val) {
    return val.replace(val.charAt(0), val.charAt(0).toUpperCase());
  });
  return result.join(' ');
}

module.exports = { confirmAccess, removeAccents, standardName };
