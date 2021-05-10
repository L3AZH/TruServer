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
    date: req.body.date,
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create Budget successfully !!",
      newObject: dataResult,
    })
  );
});

exports.deleteBudget = AsyncMiddleware(async (req, res, next) => {
  const deleteResult = await Budget.destroy({
    where: { idBudget: req.params.idBudget },
  });
  if (deleteResult == 1) {
    return res
      .status(200)
      .json(
        new SuccessResponse(200, { message: "Delete Budget successfully !!" })
      );
  }
  return res.status(500).json(
    new ErrorResponse(500, {
      message: "Can't Delete Budget Something was wrong ",
    })
  );
});

exports.updateBudget = AsyncMiddleware(async (req, res, next) => {
  const dataBefore = await Budget.findByPk(req.params.idBudget);
  if (req.body.amount) dataBefore.amountBudget = req.body.amount;
  if (req.body.note) dataBefore.note = req.body.note;
  if (req.body.date) dataBefore.date = req.body.date;
  const updateResult = await Budget.update(
    {
      amountBudget: dataBefore.amountBudget,
      note: dataBefore.note,
      date: dataBefore.date,
    },
    { where: { idBudget: dataBefore.idBudget } }
  );
  if (updateResult == 1) {
    return res
      .status(200)
      .json(
        new SuccessResponse(200, {
          message: "Update Budget successfully !!",
          updateObejct: dataBefore,
        })
      );
  }
  return res.status(400).json(
    new ErrorResponse(400, {
      message:
        "Can't Update Budget, Something was wrong or data is the same with data before udpate",
    })
  );
});
