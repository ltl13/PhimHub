const CustomerType = require("../models/CustomerType");

const getCustomerType = async (req, res) => {
  try {
    const customerType = await CustomerType.findById(req.id);
    if (!customerType) {
      return res.status(404).json({
        success: false,
        message: "Customer type not found",
      });
    }
    return res.status(200).json({
      success: true,
      customerType,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createCustomerType = async (req, res) => {
  try {
    const { typeName } = req.body;

    // Check if this customer type has existed in the database
    const customerType = await CustomerType.findOne({ typeName });
    if (customerType) {
      return res.status(400).json({
        success: false,
        message: "This customer type has existed",
      });
    }

    // Add new customer type
    const newCustomerType = new CustomerType({
      typeName,
    });
    await newCustomerType.save();
    return res.status(201).json({
      success: true,
      message: "New customer type has just been added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCusomerType = async (req, res) => {
  try {
    const { typeName } = req.body;
  } catch (error) {}
};

module.exports = { createCustomerType, getCustomerType };
