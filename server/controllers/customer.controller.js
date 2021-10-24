const Customer = require("../models/Customer");
const { addNewCustomer } = require("../shared/functions");

const createNewCustomer = async (req, res) => {
  try {
    const {
      customerType,
      account,
      phoneNumber,
      email,
      name,
      sex,
      dateOfBirth,
    } = req.body;
  } catch (error) {}
};
