const CustomerType = require("../models/CustomerType");

const addCustomerType = async (req, res) => {
  try {
    const { typeName } = req.body;

    // Validation
    if (!typeName) {
      return res.status(400).json({
        success: false,
        message: "The type name must not be null",
      });
    }

    // Check if this customer type has existed in the database
    const customerType = await CustomerType.findOne({ typeName });
    if (customerType) {
      return res.status(400).json({
        success: false,
        message: "This customer type has existed in the database",
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
      success: true,
      message: "Internal server error",
    });
  }
};
