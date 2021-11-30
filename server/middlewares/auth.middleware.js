const jsonwebtoken = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Access token not found',
      });
    }
    const verify = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.body.id = verify.id;
    req.body.staffTypeJwt = verify.staffType;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = verifyToken;
