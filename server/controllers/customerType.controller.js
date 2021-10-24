const CustomerType = require("../models/CustomerType");
const Customer = require("../models/Customer");

const getAllCustomerTypes = async (req, res) => {
  try {
    const listCustomerTypes = await CustomerType.find();
    return res.status(200).json({
      success: true,
      allCustomerTypes: listCustomerTypes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getCustomerType = async (req, res) => {
  try {
    const customerType = await CustomerType.findById(req.params.id);
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

const updateCustomerType = async (req, res) => {
  try {
    const { typeName } = req.body;

    // Check if customer exists in database
    const customerType = await CustomerType.findById(req.params.id);
    if (!customerType) {
      return res.status(404).json({
        success: false,
        message: "Customer type not found",
      });
    }

    // Check if new type name has existed
    const checker = await CustomerType.findOne({
      typeName,
    });
    console.log(customerType.typeName != typeName);
    if (checker && customerType.typeName != typeName) {
      return res.status(400).json({
        success: false,
        message: "This customer type has existed",
      });
    }

    // Update new type name
    await CustomerType.findByIdAndUpdate(
      req.params.id,
      {
        typeName,
      },
      { new: true }
    ).then((result) => result.save());

    // Updated successfully
    return res.status(200).json({
      success: true,
      message: "Customer type has been updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCustomerType = async (req, res) => {
  try {
    // Check if there are still customers of this type
    const customerChecker = await Customer.findOne({
      customerType: req.params.id,
      status: true,
    });
    if (customerChecker) {
      return res.status(406).json({
        success: false,
        message:
          "Can not delete because there are still customers of this type",
      });
    }

    // Delete customer type
    const deleteCustomerType = await CustomerType.findByIdAndDelete(
      req.params.id
    );
    if (!deleteCustomerType) {
      return res.status(404).json({
        success: false,
        message: "Customer type not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Delete customer type successfully",
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
  createCustomerType,
  getCustomerType,
  getAllCustomerTypes,
  updateCustomerType,
  deleteCustomerType,
};
