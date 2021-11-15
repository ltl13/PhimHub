const jsonwebtoken = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Access token not found',
      });
    }
    const verify = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verify) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    req.body.id = verify.id;
    req.body.role = verify.role;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = verifyToken;
