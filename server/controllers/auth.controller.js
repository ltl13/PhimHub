const argon2 = require("argon2");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Account = require("../models/Account");
const Customer = require("../models/Customer");
const { addNewCustomer } = require("../shared/functions");

const getAuth = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).select("-password");
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const register = async (req, res) => {
  try {
    const {
      password,
      customerType,
      phoneNumber,
      email,
      name,
      sex,
      dateOfBirth,
    } = req.body;

    const account = await Account.findOne({ username: phoneNumber });
    // Check if account already existed
    if (account) {
      return res.status(400).json({
        success: false,
        message: "This phone number has been used for register before",
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
    try {
      const newCustomer = await addNewCustomer({
        customerType,
        phoneNumber,
        email,
        name,
        sex,
        dateOfBirth,
        account: newAccount,
      });
      await newCustomer.save();
      await newAccount.save();
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "Email has been used for register before",
      });
    }

    // Return access token
    const accessToken = jsonwebtoken.sign(
      { id: newAccount._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    newAccount.token = accessToken;
    newAccount.save();

    res.status(201).json({
      success: true,
      message: "New account created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).send({
        success: false,
        message: "Missing phoneNumber and/or password",
      });
    }

    // Check for existing account
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Incorrect phone number or password",
      });
    }

    // Check for correct password
    const correctPassword = await argon2.verify(account.password, password);
    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect phone number or password",
      });
    }

    // Login in
    const accessToken = jsonwebtoken.sign(
      { id: account._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    account.token = accessToken;
    account.save();
    res.status(201).json({
      success: true,
      message: "User logged in",
      isAdmin: account.isAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await Customer.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email does not exist",
      });
    }

    // Send new password to user's email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "thanhluan130201@gmail.com",
        pass: "Luan130201",
      },
    });
    const newPassword = Math.random().toString(36).slice(-8);
    const content = {
      from: '"PhimHub" <phimhub@cinema.com>',
      to: email,
      subject: "Hello",
      text: "Reset your password",
      html: `<b>Hello, this is your new password: </b>${newPassword}`,
    };
    transporter.sendMail(content, async function (err, info) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          success: false,
          message: "There is an error occurred when sending email",
        });
      } else {
        // Change user's password in database
        const hashPassword = await argon2.hash(newPassword);
        const updatePassword = await Customer.findOneAndUpdate(
          { email },
          { password: hashPassword },
          { new: true }
        );
        if (!updatePassword) {
          return res.status(400).json({
            success: false,
            message: "Update password failed due to no authorization",
          });
        }

        // Return status code
        return res.status(200).json({
          success: true,
          message: "Password reset email sent",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.body;
    const account = await Account.findOneAndUpdate(
      { token },
      { token: "" },
      { new: true }
    );
    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Logout failed due to no authorization",
      });
    }
    account.save();
    return res.status(200).json({
      success: true,
      message: "User logout successfully",
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
  getAuth,
  register,
  login,
  resetPassword,
  logout,
};
