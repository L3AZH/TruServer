const { body, param, validationResult } = require("express-validator");
const Transaction = require("../database/models/Transaction");
const { ErrorResponse } = require("../models/ErrorResponse");

module.exports = {
  getTransactionWithIdWalletValidation: [
    param("idWallet")
      .notEmpty()
      .withMessage("please input id wallet")
      .isNumeric()
      .withMessage("Invalid Id Wallet"),
  ],
  getTransactionWithIdWalletAndIdTypeValidation: [
    param("idWallet")
      .notEmpty()
      .withMessage("please input id wallet")
      .isNumeric()
      .withMessage("Invalid Id Wallet"),
    param("idTransType")
      .notEmpty()
      .withMessage("please input id transtype")
      .isNumeric()
      .withMessage("Invalid Id TransType"),
  ],
  createNewTransactionValidation: [
    body("idWallet")
      .trim()
      .notEmpty()
      .withMessage("please input id wallet")
      .isNumeric()
      .withMessage("Invalid Id Wallet"),
    body("idTransType")
      .trim()
      .notEmpty()
      .withMessage("please input id transtype")
      .isNumeric()
      .withMessage("Invalid Id TransType"),
    body("amount")
      .trim()
      .notEmpty()
      .withMessage("Please fill amount")
      .isNumeric()
      .withMessage("Invalid amount")
      .custom(async (value) => {
        if (parseFloat(value) < 0)
          return Promise.reject("Amount must not negative");
      }),
    body("note").trim(),
    body("date").notEmpty().withMessage("Please input date"),
  ],
  deleteTransactionValidation: [
    param("idTransaction")
      .trim()
      .notEmpty()
      .withMessage("Please fill id transaction")
      .isNumeric()
      .withMessage("Invalid Transaction ID")
      .custom(async (value) => {
        const dataResult = await Transaction.findByPk(value);
        if (dataResult == null)
          return Promise.reject("Id Transaction not found");
      }),
  ],
  updateTransactionParamsValidation: [
    param("idTransaction")
      .trim()
      .notEmpty()
      .withMessage("Please fill id transaction")
      .isNumeric()
      .withMessage("Invalid Transaction ID")
      .custom(async (value) => {
        const dataResult = await Transaction.findByPk(value);
        if (dataResult == null)
          return Promise.reject("Id Transaction not found");
      }),
  ],
  updateTransactionBodyValidation: [
    body("idTransType").trim().isNumeric().withMessage("Invalid Id TransType"),
    body("amount").trim().isNumeric().withMessage("Invalid Amount"),
    body("note").trim(),
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
