const argon2 = require("argon2");
const jsonwebtoken = require("jsonwebtoken");
const Account = require("../models/Account");

const getAuth = async (req, res) => {
  try {
    const account = await Account.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const registerNewAccount = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing username and/or password",
      });
    }

    const account = Account.findOne({ username });
    // Check if username already existed
    if (account) {
      return res.status(400).json({
        success: false,
        message: "Username already existed",
      });
    }

    // Create account
    const hashPassword = await argon2.hash(password);
    const newAccount = new Account({ username, password: hashPassword });
    await newAccount.save();

    // Return access token
    const accessToken = jsonwebtoken.sign(
      { userId: newAccount._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(201).json({
      success: true,
      message: "New account created successfully",
      accessToken,
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
      { userId: account._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.status(201).json({
      success: true,
      message: "User logged in",
      accessToken,
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
  registerNewAccount,
  login,
};
