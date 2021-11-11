const argon2 = require("argon2");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Account = require("../models/Account");
const Customer = require("../models/Customer");
const Role = require("../models/Role");

const getAuthById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
      .populate({ path: "role", select: "roleName" })
      .select("-password");
    if (!account) {
      return res.status(406).json({
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

    // Check if email or phone number has been used for register before
    let checker = await Customer.findOne({ phoneNumber, status: true });
    if (checker) {
      return res.status(400).json({
        success: false,
        invalid: "phoneNumber",
        message: "This phone number has been used for register before",
      });
    }
    checker = await Customer.findOne({ email, status: true });
    if (checker) {
      return res.status(400).json({
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
      role: role._id,
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

    // Return access token
    const accessToken = jsonwebtoken.sign(
      { id: newAccount._id, role: newAccount.role },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(201).json({
      success: true,
      message: "New account created successfully",
      token: accessToken,
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

    // Check for existing account
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(406).json({
        success: false,
        message: "Incorrect phone number or username",
      });
    }

    // Check for correct password
    const correctPassword = await argon2.verify(account.password, password);
    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Login in
    const accessToken = jsonwebtoken.sign(
      { id: account._id, role: account.role },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(201).json({
      success: true,
      message: "User logged in",
      token: accessToken,
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
    const user = await Customer.findOne({ email, status: true });
    if (!user) {
      return res.status(406).json({
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
          { email, status: true },
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
    await account.save();
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
  getAuthById,
  register,
  login,
  resetPassword,
  logout,
};
