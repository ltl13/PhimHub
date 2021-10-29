const argon2 = require("argon2");

const Account = require("../models/Account");
const Customer = require("../models/Customer");
const { confirmAccess } = require("../shared/functions");

const getAllCustomers = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "getAllCustomers",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const allCustomers = await Customer.find({ status: true }).populate({
      path: "customerType",
      select: "typeName",
    });
    if (allCustomers) {
      return res.status(200).json({
        success: true,
        message: "Get all customers successfully",
        allCustomers,
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

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      status: true,
    }).populate("customerType", "typeName");
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
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "createNewCustomer",
  });
  if (!confirm) return res.redirect("back");

  // Passed
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
    let checker = await Customer.findOne({ phoneNumber, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: "phoneNumber",
        message: "This phone number has been used for register before",
      });
    }

    checker = await Customer.findOne({ email, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: "email",
        message: "This email has been used for register before",
      });
    }

    // Create account
    const role = await Role.findOne({ roleName: "customer" });
    if (!role) {
      return res.status(406).json({
        success: false,
        message:
          "It looks like you can not create an account now due to our database's error",
      });
    }
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
      dateOfBirth: new Date(dateOfBirth.concat("T00:00:20Z")),
      account: newAccount._id,
    });
    await newAccount.save();
    await newCustomer.save();

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

const updateCustomerById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    role: req.body.role,
    func: "updateCustomerById",
  });
  if (!confirm) return res.redirect("back");

  // Passed
  try {
    const { customerType, phoneNumber, email, name, sex, dateOfBirth } =
      req.body;

    // Check if this customer exists
    const customer = await Customer.findOne({
      _id: req.params.id,
      status: true,
    });
    if (!customer)
      return res.status(404).json({
        status: false,
        message: "Customer not found",
      });

    // Check if email or phone number doesn't change
    // Check if email or phone number has been used for register before
    let checker = await Customer.findOne({ phoneNumber, status: true });
    if (checker && phoneNumber !== customer.phoneNumber) {
      return res.status(400).json({
        success: false,
        invalid: "phoneNumber",
        message: "This phone number has been used for register before",
      });
    }
    checker = await Customer.findOne({ email, status: true });
    if (checker && email !== customer.email) {
      return res.status(400).json({
        success: false,
        invalid: "email",
        message: "This email has been used for register before",
      });
    }

    // Update customer
    await Customer.findOneAndUpdate(
      { _id: req.params.id, status: true },
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
      message: "Customer's information has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCustomerById = async (req, res) => {
  try {
    // Check if user can access this route
    const confirm = await confirmAccess({
      role: req.body.role,
      func: "deleteCustomerById",
    });
    if (!confirm) return res.redirect("back");

    // Delete customer
    const deleteCustomer = await Customer.findOneAndUpdate(
      { _id: req.params.id, status: true },
      { status: false },
      { new: true }
    );
    if (!deleteCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Delete account goes with that customer
    const checker = await Account.findByIdAndDelete(deleteCustomer.account);
    if (!checker) {
      return res.status(404).json({
        success: false,
        message:
          "Found the customer but not found the account, maybe this customer has been deleted",
      });
    }
    deleteCustomer.save();

    return res.status(200).json({
      success: true,
      message: "Delete customer successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createNewCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};
