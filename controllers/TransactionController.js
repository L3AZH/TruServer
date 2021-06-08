const lodash = require("lodash");
const Transaction = require("../database/models/Transaction");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");
const Wallet = require("../database/models/Wallet");
const Account = require("../database/models/Account");
const TransType = require("../database/models/TransType");
const e = require("cors");

exports.getAllTransactionOfUser = AsyncMiddleware(async (req, res, next) => {
  const emailUser = await Account.findByPk(req.user._email);
  const dataResult = await sequelize.query(
    "select idTransaction, Wallet_idWallet, email, TransType_idTransType, type, Transaction.amount, note, date " +
      "from Wallet, Account, TransType, Transaction " +
      "where Account.email = :emailOfUser and " +
      "Wallet.Account_email = Account.email and " +
      "Wallet.idWallet = Transaction.Wallet_idWallet and " +
      "Transaction.TransType_idTransType = TransType.idTransType",
    { type: QueryTypes.SELECT, replacements: { emailOfUser: emailUser.email } }
  );
  if (dataResult == null || dataResult.length == 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Cant find any transaction with email: ${emailUser.email}`,
      })
    );
  }
  return res.status(200).json(new SuccessResponse(200, { result: dataResult }));
});

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
  const listWallet = await sequelize.query(
    "select idWallet,amount,type " +
      "from Wallet,WalletType " +
      "where Wallet.WalletType_idWalletType = WalletType.idWalletType and Wallet.Account_email = :email",
    { type: QueryTypes.SELECT, replacements: { email: req.user._email } }
  );
  const tranType = await TransType.findByPk(req.body.idTransType);
  if (tranType.type === "Chi") {
    wallet.amount = wallet.amount - req.body.amount;
    if (wallet.amount < 0) {
      return res.status(400).json(
        new ErrorResponse(400, {
          message: "Cant create transaction, wallet will be negative!!",
        })
      );
    }
    await Wallet.update(
      { amount: wallet.amount },
      { where: { idWallet: wallet.idWallet } }
    );
  }
  if (tranType.type === "Thu") {
    if (tranType.categoryName === "Luong") {
      await editListWallet(listWallet, req.body.amount, true);
    } else {
      wallet.amount = wallet.amount + req.body.amount;
      await Wallet.update(
        { amount: wallet.amount },
        { where: { idWallet: wallet.idWallet } }
      );
    }
  }
  const dataResult = await Transaction.create({
    WalletIdWallet: req.body.idWallet,
    TransTypeIdTransType: req.body.idTransType,
    amount: req.body.amount,
    note: req.body.note,
    date: new Date(req.body.date),
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create transaction successfully !!",
      newObject: dataResult,
    })
  );
});

exports.deleteTransaction = AsyncMiddleware(async (req, res, next) => {
  const transaction = await Transaction.findByPk(req.params.idTransaction);
  const wallet = await Wallet.findByPk(transaction.WalletIdWallet);
  const listWallet = await sequelize.query(
    "select idWallet,amount,type " +
      "from Wallet,WalletType " +
      "where Wallet.WalletType_idWalletType = WalletType.idWalletType and Wallet.Account_email = :email",
    { type: QueryTypes.SELECT, replacements: { email: req.user._email } }
  );
  const tranType = await TransType.findByPk(transaction.TransTypeIdTransType);
  if (tranType.type === "Chi") {
    wallet.amount = wallet.amount + transaction.amount;
    await Wallet.update(
      { amount: wallet.amount },
      { where: { idWallet: wallet.idWallet } }
    );
  }
  if (tranType.type === "Thu") {
    if (tranType.categoryName === "Luong") {
      if (!checkListViAmKhiEditLuong(listWallet, transaction.amount, false)) {
        await editListWallet(listWallet, transaction.amount, false);
      } else {
        return res.status(400).json(
          new ErrorResponse(400, {
            message: `Cant delete transaction, wallet will be negative!!`,
          })
        );
      }
    } else {
      wallet.amount = wallet.amount - transaction.amount;
      if (wallet.amount < 0) {
        return res.status(400).json(
          new ErrorResponse(400, {
            message: `Cant delete transaction, this wallet will be negative!!`,
          })
        );
      }
      await Wallet.update(
        { amount: wallet.amount },
        { where: { idWallet: wallet.idWallet } }
      );
    }
  }
  await Transaction.destroy({
    where: { idTransaction: req.params.idTransaction },
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Delete Transaction successfully !!",
    })
  );
});

exports.updateTransaction = AsyncMiddleware(async (req, res, next) => {
  //check idTransaction tồn tại hay chưa trong validation
  const dataBeforeUpdate = await Transaction.findByPk(req.params.idTransaction);
  const wallet = await Wallet.findByPk(dataBeforeUpdate.WalletIdWallet);
  const listWallet = await sequelize.query(
    "select idWallet,amount,type " +
      "from Wallet,WalletType " +
      "where Wallet.WalletType_idWalletType = WalletType.idWalletType and Wallet.Account_email = :email",
    { type: QueryTypes.SELECT, replacements: { email: req.user._email } }
  );
  const tranType = await TransType.findByPk(
    dataBeforeUpdate.TransTypeIdTransType
  );
  if (tranType.type === "Chi") {
    wallet.amount = wallet.amount + dataBeforeUpdate.amount;
  }
  if (tranType.type === "Thu") {
    if (tranType.categoryName === "Luong") {
      for (let i = 0; i < listWallet.length; i++) {
        switch (listWallet[i].type) {
          case "Chi tieu can thiet": {
            listWallet[i].amount =
              listWallet[i].amount - dataBeforeUpdate.amount * 0.55;
            console.log(listWallet[i].amount);
            console.log(dataBeforeUpdate.amount);
            break;
          }
          case "Tiet kiem dai han": {
            listWallet[i].amount =
              listWallet[i].amount - dataBeforeUpdate.amount * 0.1;
            break;
          }
          case "Quy giao duc": {
            listWallet[i].amount =
              listWallet[i].amount - dataBeforeUpdate.amount * 0.1;
            break;
          }
          case "Huong thu": {
            listWallet[i].amount =
              listWallet[i].amount - dataBeforeUpdate.amount * 0.1;
            break;
          }
          case "Tu do tai chinh": {
            listWallet[i].amount =
              listWallet[i].amount - dataBeforeUpdate.amount * 0.1;
            break;
          }
          case "Quy tu thien": {
            listWallet[i].amount =
              listWallet[i].amount - dataBeforeUpdate.amount * 0.05;
            break;
          }
        }
      }
    } else {
      wallet.amount = wallet.amount - dataBeforeUpdate.amount;
    }
  }
  if (req.body.idTransType)
    dataBeforeUpdate.TransTypeIdTransType = req.body.idTransType;
  if (req.body.amount) dataBeforeUpdate.amount = Number(req.body.amount);
  if (req.body.note) dataBeforeUpdate.note = req.body.note;
  console.log(dataBeforeUpdate.amount);
  if (tranType.type === "Chi") {
    wallet.amount = wallet.amount - dataBeforeUpdate.amount;
    if (wallet.amount < 0) {
      return res.status(400).json(
        new ErrorResponse(400, {
          message: "Cant update transaction, wallet will be negative!!",
        })
      );
    }
    await Wallet.update(
      { amount: wallet.amount },
      { where: { idWallet: wallet.idWallet } }
    );
  }
  if (tranType.type === "Thu") {
    if (tranType.categoryName === "Luong") {
      console.log(listWallet[0].amount);
      console.log(dataBeforeUpdate.amount);
      if (
        !checkListViAmKhiEditLuong(listWallet, dataBeforeUpdate.amount, true)
      ) {
        await editListWallet(listWallet, dataBeforeUpdate.amount, true);
      } else {
        return res.status(400).json(
          new ErrorResponse(400, {
            message: `Cant update transaction, wallet will be negative!!`,
          })
        );
      }
    } else {
      wallet.amount = wallet.amount + dataBeforeUpdate.amount;
      if (wallet.amount < 0) {
        return res.status(400).json(
          new ErrorResponse(400, {
            message: `Cant update transaction, this wallet will be negative!!`,
          })
        );
      }
      await Wallet.update(
        { amount: wallet.amount },
        { where: { idWallet: wallet.idWallet } }
      );
    }
  }
  await Transaction.update(
    {
      TransTypeIdTransType: dataBeforeUpdate.TransTypeIdTransType,
      amount: dataBeforeUpdate.amount,
      note: dataBeforeUpdate.note,
    },
    { where: { idTransaction: dataBeforeUpdate.idTransaction } }
  );
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Update Transaction successfully !!",
      updateObject: dataBeforeUpdate,
    })
  );
});

function checkListViAmKhiEditLuong(listWallet, luong, isAdd) {
  const listWalletForCheck = lodash.cloneDeep(listWallet);
  for (let i = 0; i < listWalletForCheck.length; i++) {
    switch (listWalletForCheck[i].type) {
      case "Chi tieu can thiet": {
        if (isAdd) {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount + luong * 0.55;
        } else {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount - luong * 0.55;
        }
        break;
      }
      case "Tiet kiem dai han": {
        if (isAdd) {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount + luong * 0.1;
        } else {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount - luong * 0.1;
        }
        break;
      }
      case "Quy giao duc": {
        if (isAdd) {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount + luong * 0.1;
        } else {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount - luong * 0.1;
        }
        break;
      }
      case "Huong thu": {
        if (isAdd) {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount + luong * 0.1;
        } else {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount - luong * 0.1;
        }
        break;
      }
      case "Tu do tai chinh": {
        if (isAdd) {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount + luong * 0.1;
        } else {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount - luong * 0.1;
        }
        break;
      }
      case "Quy tu thien": {
        if (isAdd) {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount + luong * 0.05;
        } else {
          listWalletForCheck[i].amount =
            listWalletForCheck[i].amount - luong * 0.05;
        }
        break;
      }
    }
    if (listWalletForCheck[i].amount < 0) {
      console.log(listWalletForCheck[i].type);
      console.log(listWalletForCheck[i].amount);
      return true;
    }
  }
  return false;
}

async function editListWallet(listWallet, luong, isAdd) {
  for (let i = 0; i < listWallet.length; i++) {
    switch (listWallet[i].type) {
      case "Chi tieu can thiet": {
        if (isAdd) {
          listWallet[i].amount = listWallet[i].amount + luong * 0.55;
        } else {
          listWallet[i].amount = listWallet[i].amount - luong * 0.55;
        }
        break;
      }
      case "Tiet kiem dai han": {
        if (isAdd) {
          listWallet[i].amount = listWallet[i].amount + luong * 0.1;
        } else {
          listWallet[i].amount = listWallet[i].amount - luong * 0.1;
        }
        break;
      }
      case "Quy giao duc": {
        if (isAdd) {
          listWallet[i].amount = listWallet[i].amount + luong * 0.1;
        } else {
          listWallet[i].amount = listWallet[i].amount - luong * 0.1;
        }
        break;
      }
      case "Huong thu": {
        if (isAdd) {
          listWallet[i].amount = listWallet[i].amount + luong * 0.1;
        } else {
          listWallet[i].amount = listWallet[i].amount - luong * 0.1;
        }
        break;
      }
      case "Tu do tai chinh": {
        if (isAdd) {
          listWallet[i].amount = listWallet[i].amount + luong * 0.1;
        } else {
          listWallet[i].amount = listWallet[i].amount - luong * 0.1;
        }
        break;
      }
      case "Quy tu thien": {
        if (isAdd) {
          listWallet[i].amount = listWallet[i].amount + luong * 0.05;
        } else {
          listWallet[i].amount = listWallet[i].amount - luong * 0.05;
        }
        break;
      }
    }
    await Wallet.update(
      { amount: listWallet[i].amount },
      { where: { idWallet: listWallet[i].idWallet } }
    );
  }
}
