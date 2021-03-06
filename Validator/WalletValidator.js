const { body, param, validationResult } = require("express-validator");
const { ErrorResponse } = require("../models/ErrorResponse");
const Account = require("../database/models/Account");
const WalletType = require("../database/models/WalletType");

module.exports = {
  createWalletValidation: [
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
    // body("email")
    //   .trim()
    //   .notEmpty()
    //   .withMessage("Please fill email")
    //   .isEmail()
    //   .withMessage("Invalid email")
    //   .custom(async (value) => {
    //     const dataResult = await Account.findByPk(value);
    //     if (dataResult == null) return Promise.reject("Not found any email !!");
    //   }),
    body("idWalletType")
      .trim()
      .notEmpty()
      .withMessage("Please fill id wallet type")
      .isNumeric()
      .withMessage("Invalid id wallet type")
      .custom(async (value) => {
        const dataResult = await WalletType.findByPk(value);
        if (dataResult == null)
          return Promise.reject("Not found any id wallet type !! ");
      }),
  ],
  deleteWalletWithNameValidation: [
    //custom cái type ko tồn tại
    param("type").trim().notEmpty().withMessage("Type is missing in param"),
  ],
  updateWalletWithNameBodyValidation: [
    body("amount")
      .trim()
      .notEmpty()
      .withMessage("Please input amount")
      .isNumeric()
      .withMessage("Invalid amount"),
  ],
  updateWalletWithNameParamsValidation: [
    //custom cái type ko tồn tại
    param("type").trim().notEmpty().withMessage("Type is missing in param"),
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
