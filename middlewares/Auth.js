const { ErrorResponse } = require("../models/ErrorResponse");
const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json(new ErrorResponse(401, "Invalid token, Accessed denied !!"));
  }
  try {
    const decode = jwt.verify(token, process.env.DB_PRIVATEKEY);
    req.user = decode;
    next();
  } catch (err) {
    return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
  }
};

module.exports = jwtAuth;
