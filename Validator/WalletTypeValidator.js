const { body, param, validationResult } = require("express-validator");
const WalletType = require("../database/models/WalletType");
const Wallet = require("../database/models/Wallet");
const { ErrorResponse } = require("../models/ErrorResponse");

module.exports = {
  createNewWalletTypeValidation: [
    body("type").trim().notEmpty().withMessage("Please fill type"),
  ],
  deleteWalletTypeValidation: [
    param("idWalletType")
      .trim()
      .notEmpty()
      .withMessage("Please fill id wallet type")
      .isNumeric()
      .withMessage("Invalid Id Wallet Type")
      .custom(async (value) => {
        const dataResult = await WalletType.findByPk(value);
        if (dataResult == null) {
          return Promise.reject(
            "Not found this id Wallet Type, can not delete"
          );
        }
        const checkConstaintResult = await Wallet.findOne({
          where: { WalletTypeIdWalletType: value },
        });
        if (checkConstaintResult != null) {
          return Promise.reject(
            "This Wallet type has already used in some wallet , can not delete"
          );
        }
      }),
  ],
  updateWalletTypeParamValidation: [
    param("idWalletType")
      .trim()
      .notEmpty()
      .withMessage("Please fill id Wallet Type")
      .isNumeric()
      .withMessage("Invalid Id Walle Type")
      .custom(async (value) => {
        const dataResult = await WalletType.findByPk(value);
        if (dataResult == null) {
          return Promise.reject(
            "Not found this id Wallet Type, can not delete"
          );
        }
      }),
  ],
  updateWalletTypeBodyValidation: [body("type").trim()],
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
