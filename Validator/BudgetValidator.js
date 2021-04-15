const { body, param, validationResult } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const Budget = require("../database/models/Budget");

module.exports = {
  getListBudgetValidation: [
    param("idWallet")
      .trim()
      .notEmpty()
      .withMessage("Please fill Id Wallet")
      .isNumeric()
      .withMessage("Invalid Id Wallet"),
  ],
  getInfoBudgetValidation: [
    param("idBudget")
      .trim()
      .notEmpty()
      .withMessage("Please fill Id Budget")
      .isNumeric()
      .withMessage("Invalid Id Budget"),
  ],
  createNewBudgetValidation: [
    body("idWallet")
      .trim()
      .notEmpty()
      .withMessage("Please fill Id Wallet")
      .isNumeric()
      .withMessage("Invalid Id Wallet"),
    body("amount")
      .trim()
      .notEmpty()
      .withMessage("Please fill amount")
      .isNumeric()
      .withMessage("Invalid amount"),
    body("note")
      .trim()
      .notEmpty()
      .withMessage("Please fill note to know what budget for ... !!"),
  ],
  result: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(new ErrorResponse(400, { error: errors.array() }));
    }
    next();
  },
};
