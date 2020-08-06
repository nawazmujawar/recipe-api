const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const getToken = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(getToken, process.env.JWT_KEY);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }
};
