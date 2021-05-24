const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    // console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    //   we have to call next if we are authenticated successfully
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Authentication failed',
    });
  }
};
