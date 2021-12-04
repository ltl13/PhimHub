const argon2 = require('argon2');
const jsonwebtoken = require('jsonwebtoken');

const Customer = require('../models/Customer');
const { confirmAccess } = require('../shared/functions');

const getAllCustomers = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CustomerManagement',
  });
  if (!confirm) return res.redirect('back');

  // Passed
  try {
    const allCustomers = await Customer.find({ status: true }).select(
      '-password'
    );
    if (allCustomers) {
      return res.status(200).json({
        success: true,
        message: 'Get all customers successfully',
        allCustomers,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getCustomerById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CustomerManagement',
  });
  if (!confirm) return res.redirect('back');

  // Passed
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      status: true,
    }).select('-password');
    if (!customer) {
      return res.status(406).json({
        success: false,
        message: 'Customer not found',
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
      message: 'Internal server error',
    });
  }
};

const createCustomer = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CustomerManagement',
  });
  if (!confirm) return res.redirect('back');

  // Passed
  try {
    const { password, phoneNumber, email, name, sex, dateOfBirth, avatar } =
      req.body;

    // Check if email or phone number has been used for register before
    let checker = await Customer.findOne({ phoneNumber, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: 'phoneNumber',
        message: 'This phone number has been used for register before',
      });
    }

    checker = await Customer.findOne({ email, status: true });
    if (checker) {
      return res.status(409).json({
        success: false,
        invalid: 'email',
        message: 'This email has been used for register before',
      });
    }

    // Create new customer
    const hashedPassword = await argon2.hash(password);
    const newCustomer = new Customer({
      phoneNumber,
      password: hashedPassword,
      email,
      name,
      sex,
      avatar,
      dateOfBirth: new Date(dateOfBirth),
    });
    await newCustomer.save();

    res.status(201).json({
      success: true,
      message: 'New customer created successfully',
      newCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const registerCustomer = async (req, res) => {
  try {
    const { password, phoneNumber, email, name, sex, dateOfBirth } = req.body;

    // Check if email or phone number has been used for register before
    let checker = await Customer.findOne({ phoneNumber, status: true });
    if (checker) {
      return res.status(400).json({
        success: false,
        invalid: 'phoneNumber',
        message: 'This phone number has been used for register before',
      });
    }
    checker = await Customer.findOne({ email, status: true });
    if (checker) {
      return res.status(400).json({
        success: false,
        invalid: 'email',
        message: 'This email has been used for register before',
      });
    }

    // Create new customer
    const hashPassword = await argon2.hash(password);
    const newCustomer = new Customer({
      phoneNumber,
      password: hashPassword,
      email,
      name,
      sex,
      dateOfBirth: new Date(dateOfBirth),
    });

    // Return access token
    const accessToken = jsonwebtoken.sign(
      { id: newCustomer._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    newCustomer.token = accessToken;
    await newCustomer.save();

    res.status(201).json({
      success: true,
      message: 'New account created successfully',
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check for existing account
    const customer = await Customer.findOne({ phoneNumber, status: true });
    if (!customer) {
      return res.status(406).json({
        success: false,
        invalid: 'phoneNumber',
        message: 'Incorrect phone number',
      });
    }

    // Check for correct password
    const correctPassword = await argon2.verify(customer.password, password);
    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        invalid: 'password',
        message: 'Incorrect password',
      });
    }

    // Login
    const accessToken = jsonwebtoken.sign(
      { id: customer._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    await Customer.findByIdAndUpdate(
      customer._id,
      { token: accessToken },
      { new: true }
    ).then(async (result) => await result.save());

    res.status(201).json({
      success: true,
      message: 'User logged in',
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateCustomerById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CustomerManagement',
  });
  if (!confirm) return res.redirect('back');

  // Passed
  try {
    const { phoneNumber, email, name, sex, dateOfBirth } = req.body;

    // Check if this customer exists
    const customer = await Customer.findOne({
      _id: req.params.id,
      status: true,
    });
    if (!customer)
      return res.status(406).json({
        status: false,
        message: 'Customer not found',
      });

    // Check if email or phone number doesn't change
    // Check if email or phone number has been used for register before
    let checker = await Customer.findOne({ phoneNumber, status: true });
    if (checker && phoneNumber !== customer.phoneNumber) {
      return res.status(400).json({
        success: false,
        invalid: 'phoneNumber',
        message: 'This phone number has been used for register before',
      });
    }
    checker = await Customer.findOne({ email, status: true });
    if (checker && email !== customer.email) {
      return res.status(400).json({
        success: false,
        invalid: 'email',
        message: 'This email has been used for register before',
      });
    }

    // Update customer
    await Customer.findOneAndUpdate(
      { _id: req.params.id, status: true },
      {
        phoneNumber,
        email,
        name,
        sex,
        dateOfBirth: new Date(dateOfBirth),
      },
      { new: true }
    ).then(async (result) => await result.save());
    return res.status(200).json({
      success: true,
      message: "Customer's information has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const sendChangePasswordTokenCustomer = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const customer = await Customer.findOne({ email, status: true });
    if (!customer) {
      return res.status(406).json({
        success: false,
        invalid: 'email',
        message: 'Email has not been registered yet',
      });
    }

    // Send new password to user's email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'thanhluan130201@gmail.com',
        pass: 'Luan130201',
      },
    });
    const changePasswordToken = Math.random().toString().slice(-6);
    const content = {
      from: '"PhimHub" <phimhub@cinema.com>',
      to: email,
      subject: 'Hello',
      text: 'Reset your password',
      html: `<b>Hello, this is your change password token, please do not share it to anyone. Please note that this token will expire after 15 minutes: </b>${changePasswordToken}`,
    };
    const respondToken = jsonwebtoken.sign(
      { id: customer._id, token: changePasswordToken },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '900s' }
    );
    transporter.sendMail(content, async function (err, info) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          success: false,
          message: 'There is an error occurred when sending email',
        });
      } else {
        // Return status code
        return res.status(200).json({
          success: true,
          message: 'Change password token was sent to user',
          token: respondToken,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const changePasswordCustomer = async (req, res) => {
  try {
    const { token, id, inputToken, newPassword } = req.body;
    if (token != inputToken)
      return res.status(400).json({
        success: false,
        invalid: 'inputToken',
        message: 'Wrong token!!!',
      });

    // Change user's password in database
    const hashedPassword = await argon2.hash(newPassword);
    const updatePassword = await Customer.findOneAndUpdate(
      { _id: id, status: true },
      { password: hashedPassword },
      { new: true }
    );
    await updatePassword.save();
    if (!updatePassword) {
      return res.status(400).json({
        success: false,
        message: 'Update password failed due to no authorization',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Change password successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const deleteCustomerById = async (req, res) => {
  // Check if user can access this route
  const confirm = await confirmAccess({
    staffType: req.body.staffTypeJwt,
    func: 'CustomerManagement',
  });
  if (!confirm) return res.redirect('back');

  // Passed
  try {
    // Delete customer
    const deleteCustomer = await Customer.findOneAndUpdate(
      { _id: req.params.id, status: true },
      { status: false },
      { new: true }
    );
    if (!deleteCustomer) {
      return res.status(406).json({
        success: false,
        message: 'Customer not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Delete customer successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  createCustomer,
  registerCustomer,
  loginCustomer,
  sendChangePasswordTokenCustomer,
  changePasswordCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};
