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

function createRowColumnPreview(seats, idEmptySeatType) {
  let previewRowCount = -1;
  const tempRowPreview = [];

  const emptySeatPerColCount = [];
  let previewColumnCount = -1;

  seats.forEach((row) => {
    let isHaveNonEmptySeat = false;

    row.forEach((item, index) => {
      emptySeatPerColCount[index] =
        (!!emptySeatPerColCount[index] ? emptySeatPerColCount[index] : 0) +
        (item === idEmptySeatType ? 0 : 1);

      isHaveNonEmptySeat = item !== idEmptySeatType || isHaveNonEmptySeat;
    });

    tempRowPreview.push(isHaveNonEmptySeat ? ++previewRowCount : -1);
  });

  return {
    rowPreview: tempRowPreview,
    columnPreview: emptySeatPerColCount.map((item) =>
      item === 0 ? -1 : ++previewColumnCount
    ),
  };
}

function numToAlphabet(num) {
  let s = '';
  let t;

  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return s || undefined;
}

module.exports = {
  confirmAccess,
  removeAccents,
  standardName,
  createRowColumnPreview,
  numToAlphabet,
};
