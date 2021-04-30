const { body, validationResult } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const Account = require("../database/models/Account");

module.exports = {
  userRegisterValidation: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("This is not a email")
      .notEmpty()
      .withMessage("Please fill email address")
      .custom(async (value) => {
        const dataResult = await Account.findByPk(value);
        if (dataResult != null)
          return Promise.reject("Email has already used !!");
      }),
    body("password").trim().notEmpty().withMessage("Please fill password"),
    body("username").trim().notEmpty().withMessage("Please fill username"),
    body("phone")
      .trim()
      .isNumeric()
      .withMessage("Invalid Phone numer")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be 10 digit")
      .notEmpty()
      .withMessage("Please fill phone number"),
  ],
  userLoginValidation: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email")
      .notEmpty()
      .withMessage("Please fill email address"),
    body("password").trim().notEmpty().withMessage("Please fill password "),
  ],
  result: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        new ErrorResponse(400, {
          message: errors.array()[0].msg,
        })
      );
    }
    next();
  },
};
