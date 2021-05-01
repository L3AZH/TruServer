const { ErrorResponse } = require("../models/ErrorResponse");
const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
  const authBearString = req.headers.authorization;
  console.log("origin: " + authBearString);
  if (!authBearString) {
    return res
      .status(401)
      .json(
        new ErrorResponse(401, { message: "Invalid token, Accessed denied !!" })
      );
  }
  try {
    const token = authBearString.split(" ")[1];
    console.log("split[1]: " + token);
    const decode = jwt.verify(token, process.env.DB_PRIVATEKEY);
    req.user = decode;
    next();
  } catch (err) {
    return res
      .status(401)
      .json(new ErrorResponse(401, { message: "Unauthorized" }));
  }
};

module.exports = jwtAuth;
