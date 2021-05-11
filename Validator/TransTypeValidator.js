const { body, param, validationResult } = require("express-validator");
const TransType = require("../database/models/TransType");
const { ErrorResponse } = require("../models/ErrorResponse");

module.exports = {
  createNewTransTypeValidation: [
    body("type")
      .trim()
      .notEmpty()
      .withMessage("Please fill type")
      .custom(async (value) => {
        console.log(value);
        if (!(value === "Thu" || value === "Chi"))
          return Promise.reject("Invalid type");
      }),
    body("categoryName")
      .trim()
      .notEmpty()
      .withMessage("Please fill category name"),
  ],
  deleteTransTypeValidation: [
    param("idTransType")
      .trim()
      .notEmpty()
      .withMessage("Please fill Id TransType")
      .isNumeric()
      .withMessage("Invalid id TransType")
      .custom(async (value) => {
        const dataResult = await TransType.findByPk(value);
        if (dataResult == null) {
          return Promise.reject("Id TransType not found");
        }
      }),
  ],
  updateTransTypeParamValidation: [
    param("idTransType")
      .trim()
      .notEmpty()
      .withMessage("Please fill Id TransType")
      .isNumeric()
      .withMessage("Invalid id TransType")
      .custom(async (value) => {
        const dataResult = await TransType.findByPk(value);
        if (dataResult == null) {
          return Promise.reject("Id TransType not found");
        }
      }),
  ],
  updateTransTypeBodyValidation: [
    body("type")
      .trim()
      .custom(async (value) => {
        if (!(value == "Thu" || value == "Chi"))
          return Promise.reject("Invalid type");
      }),
    body("categoryName").trim(),
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
