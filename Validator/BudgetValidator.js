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
    body("date")
      .trim()
      .notEmpty()
      .withMessage("Please fill date")
      .isDate()
      .withMessage("Invalid date"),
  ],
  deleteBudgetValidation: [
    param("idBudget")
      .trim()
      .notEmpty()
      .withMessage("Please fill Id Budget")
      .isNumeric()
      .withMessage("Invalid Id Budget")
      .custom(async (value) => {
        const dataResult = await Budget.findByPk(value);
        if (dataResult == null) return Promise.reject("Id Budget not found");
      }),
  ],
  updateBudgetParamValidation: [
    param("idBudget")
      .trim()
      .notEmpty()
      .withMessage("Please fill Id Budget")
      .isNumeric()
      .withMessage("Invalid Id Budget")
      .custom(async (value) => {
        const dataResult = await Budget.findByPk(value);
        if (dataResult == null) return Promise.reject("Id Budget not found");
      }),
  ],
  updateBudgetBodyValidation: [
    body("amount").trim().isNumeric().withMessage("Invalid amount"),
    body("note").trim(),
    body("date").trim().isDate().withMessage("Invalid date"),
  ],
  result: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(new ErrorResponse(400, { message: errors.array()[0].msg }));
    }
    next();
  },
};
