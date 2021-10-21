const jwt = require("jsonwebtoken");

const Account = require("../models/Account");

const verifyAdmin = async (req, res, next) => {
  const { token } = req.body;

  // Check if user access with token or not
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token not found",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.id = decoded.id;

    // Check user's role
    const account = await Account.findById(req.body.id);
    if (!account.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this content",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = verifyAdmin;
