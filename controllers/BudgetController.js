const Budget = require("../database/models/Budget");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");

exports.getListBudgetOfWallet = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await Budget.findAll({
    where: { WalletIdWallet: req.params.idWallet },
  });
  if (dataResult == null || dataResult.length == 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: "Can't find any Budget in this Wallet",
      })
    );
  }
  return res.status(200).json(new SuccessResponse(200, { result: dataResult }));
});

exports.getInfoBudget = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await Budget.findByPk(req.params.idBudget);
  if (dataResult == null) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Can't find Budget with Id: ${req.params.idBudget}`,
      })
    );
  }
  return res.status(200).json(new SuccessResponse(200, { result: dataResult }));
});

exports.createNewBudget = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await Budget.create({
    WalletIdWallet: req.body.idWallet,
    amountBudget: req.body.amount,
    note: req.body.note,
    date: new Date(),
  });
  return res
    .status(200)
    .json(
      new SuccessResponse(200, { message: "Create Budget successfully !!" })
    );
});
