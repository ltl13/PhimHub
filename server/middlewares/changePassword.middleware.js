const jsonwebtoken = require('jsonwebtoken');

const verifyResetPasswordToken = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const headerToken = authHeader && authHeader.split(' ')[1];
    if (!headerToken)
      return res.status(406).json({
        success: false,
        message: 'Token not found',
      });
    const verify = jsonwebtoken.verify(
      headerToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!verify)
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    req.body.id = verify.id;
    req.body.token = verify.token;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = verifyResetPasswordToken;
