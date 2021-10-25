const Customer = require("../models/Customer");

const getAllCustomer = async (req, res) => {
  try {
    const allCustomers = await Customer.find().populate(
      "customerType",
      "typeName"
    );
    if (allCustomers) {
      return res.status(200).json({
        success: true,
        message: "Get all customers successfully",
        allCustomers: allCustomers,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "customerType",
      "typeName"
    );
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createNewCustomer = async (req, res) => {
  try {
    const {
      customerType,
      password,
      phoneNumber,
      email,
      name,
      sex,
      dateOfBirth,
    } = req.body;

    // Check if email or phone number has been used for register before
    let checker = await Customer.findOne({ phoneNumber });
    if (checker) {
      return res.status(400).json({
        success: false,
        invalid: "phoneNumber",
        message: "This phone number has been used for register before",
      });
    }
    checker = await Customer.findOne({ email });
    if (checker) {
      return res.status(400).json({
        success: false,
        invalid: "email",
        message: "This email has been used for register before",
      });
    }

    // Create account
    const hashPassword = await argon2.hash(password);
    const newAccount = new Account({
      username: phoneNumber,
      password: hashPassword,
      isStaff: false,
    });

    // Create new customer
    const newCustomer = new Customer({
      customerType,
      phoneNumber,
      email,
      name,
      sex,
      dateOfBirth: new Date(dateOfBirth.concat("T00:00:10Z")),
      account: newAccount._id,
    });
    await newAccount.save();
    await newCustomer.save();

    // Return access token
    const accessToken = jsonwebtoken.sign(
      { id: newAccount._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    newAccount.token = accessToken;
    newAccount.save();

    res.status(201).json({
      success: true,
      message: "New customer created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { customerType, phoneNumber, email, name, sex, dateOfBirth } =
      req.body;

    // Check if email or phone number doesn't change
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });
    }

    // Check if email or phone number has been used for register before
    let checker = await Customer.findOne({ phoneNumber });
    if (checker && email != customer.email) {
      return res.status(400).json({
        success: false,
        invalid: "phoneNumber",
        message: "This phone number has been used for register before",
      });
    }
    checker = await Customer.findOne({ email });
    if (checker && phoneNumber != customer.phoneNumber) {
      return res.status(400).json({
        success: false,
        invalid: "email",
        message: "This email has been used for register before",
      });
    }

    // Update customer
    await Customer.findByIdAndUpdate(
      req.params.id,
      {
        customerType,
        phoneNumber,
        email,
        name,
        sex,
        dateOfBirth: new Date(dateOfBirth.concat("T00:00:10Z")),
      },
      { new: true }
    ).then((result) => result.save());
    return res.status(200).json({
      success: true,
      message: "Customer has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  createNewCustomer,
  getAllCustomer,
  getCustomer,
  updateCustomer,
};
