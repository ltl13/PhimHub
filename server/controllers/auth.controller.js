const argon2 = require("argon2");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Account = require("../models/Account");
const Customer = require("../models/Customer");

const getAuth = async (req, res) => {
  try {
    const account = await Account.findById(req.body.id).select("-password");
    if (!account) {
      return res.status(400).json({
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
      username,
      password,
      // customerType,
      // phoneNumber,
      // email,
      // name,
      // sex,
      // dateOfBirth,
    } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing username and/or password",
      });
    }

    const account = await Account.findOne({ username });
    // Check if username already existed
    if (account) {
      return res.status(400).json({
        success: false,
        message: "Username already existed",
      });
    }

    // Create account
    const hashPassword = await argon2.hash(password);
    const newAccount = new Account({
      username,
      password: hashPassword,
      isAdmin: false,
    });
    await newAccount.save();

    // Create new customer
    // const newCustomer = new Customer({
    //   customerType,
    //   phoneNumber,
    //   email,
    //   name,
    //   sex,
    //   dateOfBirth,
    //   account: newAccount._id,
    // });
    // await newCustomer.save();

    // Return access token
    const accessToken = jsonwebtoken.sign(
      { id: newAccount._id },
      process.env.ACCESS_TOKEN_SECRET,
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

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing username and/or password",
      });
    }

    // Check for existing account
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });
    }

    // Check for correct password
    const correctPassword = await argon2.verify(account.password, password);
    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });
    }

    // Login in
    // Return token
    const accessToken = jsonwebtoken.sign(
      { id: account._id },
      process.env.ACCESS_TOKEN_SECRET,
    );

    res.status(201).json({
      success: true,
      message: "User logged in",
      token: accessToken,
    });

    if (account.isAdmin) {
      res.redirect("/manage/home");
    } else {
      res.redirect("/home");
    }
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
        message: "Email does not existed",
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
        res.status(422).json({
          success: false,
          message: "There is an error occurred when sending email",
        });
        res.redirect("/");
      } else {
        // Change user's password in database
        const hashPassword = await argon2.hash(newPassword);
        const updatePassword = await Customer.findOneAndUpdate(
          { email },
          { password: hashPassword },
          { new: true }
        );
        if (!updatePassword) {
          res.status(400).json({
            success: false,
            message: "Update password failed due to no authorization",
          });
          return res.redirect("/");
        }

        // Return status code
        res.status(200).json({
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

module.exports = {
  getAuth,
  register,
  login,
  resetPassword,
};
