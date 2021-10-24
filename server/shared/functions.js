const CustomerType = require("../models/CustomerType");
const Customer = require("../models/Customer");

const addNewCustomer = async (parameters) => {
  const { customerType, phoneNumber, email, name, sex, dateOfBirth, account } =
    parameters;

  // Find customer type's id
  const newCustomerType = await CustomerType.findOne({
    typeName: customerType,
  });
  const newCustomer = new Customer({
    customerType: newCustomerType._id,
    phoneNumber,
    email,
    name,
    sex,
    dateOfBirth: new Date(dateOfBirth.concat("T00:00:10Z")),
    account: account._id,
  });
  return newCustomer;
};

module.exports = { addNewCustomer };
