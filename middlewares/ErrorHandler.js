const { ErrorResponse } = require("../models/errorResponse");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  console.log(err.name);
  console.log(err.message);

  // validation errors

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res
    .status(err.statusCode)
    .json(new ErrorResponse(err.statusCode, { message: err.message }));
};

module.exports = errorHandler;
