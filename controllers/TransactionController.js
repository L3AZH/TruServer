const Transaction = require("../database/models/Transaction");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");
const Wallet = require("../database/models/Wallet");

exports.getTransactionWithIdWallet = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await sequelize.query(
    "select idTransaction, Wallet_idWallet, TransType_idTransType, type, amount, note, date " +
      "from Transaction, TransType " +
      "where Transaction.TransType_idTransType = TransType.idTransType and Transaction.Wallet_idWallet = :idWallet",
    { type: QueryTypes.SELECT, replacements: { idWallet: req.params.idWallet } }
  );
  if (dataResult == null || dataResult.length == 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Cant find any transaction with Id Wallet:${req.params.idWallet}  `,
      })
    );
  }
  return res.status(200).json(new SuccessResponse(200, { result: dataResult }));
});

exports.getTransactionWithIdWalletAndIdType = AsyncMiddleware(
  async (req, res, next) => {
    const dataResult = await sequelize.query(
      "select idTransaction, Wallet_idWallet, TransType_idTransType, type, amount, note, date " +
        "from Transaction, TransType " +
        "where Transaction.TransType_idTransType = TransType.idTransType and " +
        "Transaction.Wallet_idWallet = :idWallet and " +
        "Transaction.TransType_idTransType = :idTransType",
      {
        type: QueryTypes.SELECT,
        replacements: {
          idWallet: req.params.idWallet,
          idTransType: req.params.idTransType,
        },
      }
    );
    if (dataResult == null || dataResult.length == 0) {
      return res.status(404).json(
        new ErrorResponse(404, {
          message: `Cant find any transaction with Id Wallet:${req.params.idWallet} & Id Type: ${req.params.idTransType} `,
        })
      );
    }
    return res
      .status(200)
      .json(new SuccessResponse(200, { result: dataResult }));
  }
);

exports.createNewTransaction = AsyncMiddleware(async (req, res, next) => {
  const wallet = await Wallet.findByPk(req.body.idWallet);
  wallet.amount = wallet.amount - req.body.amount;
  if (wallet.amount > 0.0) {
    const dataResult = await Transaction.create({
      WalletIdWallet: req.body.idWallet,
      TransTypeIdTransType: req.body.idTransType,
      amount: req.body.amount,
      note: req.body.note,
      date: new Date(req.body.date),
    });
    const updateWalletResult = await Wallet.update(
      { amount: wallet.amount },
      { where: { idWallet: wallet.idWallet } }
    );
    if (updateWalletResult == 1) {
      return res.status(200).json(
        new SuccessResponse(200, {
          message: "Create transaction successfully !!",
          newObject: dataResult,
        })
      );
    } else {
      return res.status(200).json(
        new SuccessResponse(200, {
          message:
            "Create transaction successfully but update amout wallet fail !!",
          newObject: dataResult,
        })
      );
    }
  }
  return res.status(400).json(
    new SuccessResponse(400, {
      message:
        "Cant not create transaction because wallet amount will be negative",
    })
  );
});

exports.deleteTransaction = AsyncMiddleware(async (req, res, next) => {
  const transaction = await Transaction.findByPk(req.params.idTransaction);
  const wallet = await Wallet.findByPk(transaction.WalletIdWallet);
  wallet.amount = wallet.amount + transaction.amount;
  const updateWalletResult = await Wallet.update(
    { amount: wallet.amount },
    { where: { idWallet: wallet.idWallet } }
  );
  const deleteResult = await Transaction.destroy({
    where: { idTransaction: req.params.idTransaction },
  });
  if (deleteResult == 1) {
    if (updateWalletResult == 1) {
      return res.status(200).json(
        new SuccessResponse(200, {
          message: "Delete Transaction successfully !!",
        })
      );
    } else {
      return res.status(200).json(
        new SuccessResponse(200, {
          message:
            "Delete Transaction successfully but update amount wallet fail !!",
        })
      );
    }
  }
  return res.status(400).json(
    new ErrorResponse(400, {
      message: "Can't Delete Transaction, something was wrong !!!",
    })
  );
});

exports.updateTransaction = AsyncMiddleware(async (req, res, next) => {
  //check idTransaction tồn tại hay chưa trong validation
  const dataBeforeUpdate = await Transaction.findByPk(req.params.idTransaction);
  const wallet = await Wallet.findByPk(dataBeforeUpdate.WalletIdWallet);
  wallet.amount = wallet.amount + dataBeforeUpdate.amount;
  if (req.body.idTransType)
    dataBeforeUpdate.TransTypeIdTransType = req.body.idTransType;
  if (req.body.amount) dataBeforeUpdate.amount = req.body.amount;
  if (req.body.note) dataBeforeUpdate.note = req.body.note;
  wallet.amount = wallet.amount - dataBeforeUpdate.amount;
  if (wallet.amount > 0.0) {
    const updateWallet = await Wallet.update(
      { amount: wallet.amount },
      { where: { idWallet: wallet.idWallet } }
    );
    const updateResult = await Transaction.update(
      {
        TransTypeIdTransType: dataBeforeUpdate.TransTypeIdTransType,
        amount: dataBeforeUpdate.amount,
        note: dataBeforeUpdate.note,
      },
      { where: { idTransaction: dataBeforeUpdate.idTransaction } }
    );
    if (updateResult == 1) {
      if (updateWallet == 1) {
        return res.status(200).json(
          new SuccessResponse(200, {
            message: "Update Transaction successfully !!",
            updateObject: dataBeforeUpdate,
          })
        );
      } else {
        return res.status(200).json(
          new SuccessResponse(200, {
            message:
              "Update Transaction successfully but update amount wallet fail !!",
            updateObject: dataBeforeUpdate,
          })
        );
      }
    }
    return res.status(400).json(
      new ErrorResponse(400, {
        message:
          "Can't Update Transaction, something was wrong or Data is the same with Data before data update",
      })
    );
  }
  return res.status(400).json(
    new SuccessResponse(400, {
      message:
        "Cant not create transaction because wallet amount will be negative",
    })
  );
});
