const Wallet = require("../database/models/Wallet");
const Transaction = require("../database/models/Transaction");
const Budget = require("../database/models/Budget");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");

exports.getListWalletOfEmail = AsyncMiddleware(async (req, res, next) => {
  //lưu ý nếu sử dụng raw query thì phải dùng tên field ("Account_email") thay vì tên thuộc tính trong entity là AccountEmail
  const dataResult = await sequelize.query(
    "select idWallet,Account_email,amount,type " +
      "from Wallet,WalletType " +
      "where Wallet.WalletType_idWalletType = WalletType.idWalletType and Wallet.Account_email = :email",
    { type: QueryTypes.SELECT, replacements: { email: req.user._email } }
  );
  if (dataResult == null || dataResult.length == 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Cant fint any Wallet on this Email: ${req.user._email}`,
      })
    );
  }
  return res.status(200).json(new SuccessResponse(200, { result: dataResult }));
});

exports.newWallet = AsyncMiddleware(async (req, res, next) => {
  const isWalletExist = await Wallet.findOne({
    where: {
      AccountEmail: req.user._email,
      WalletTypeIdWalletType: req.body.idWalletType,
    },
  });
  if (isWalletExist != null)
    return res.status(400).json(
      new ErrorResponse(400, {
        message: "Wallet with this type already exist on this Account !!",
        newObject: dataResult,
      })
    );
  await Wallet.create({
    amount: req.body.amount,
    AccountEmail: req.user._email,
    WalletTypeIdWalletType: req.body.idWalletType,
  });
  return res
    .status(200)
    .json(
      new SuccessResponse(200, { message: "Created Wallet successfully !!" })
    );
});

exports.deleteWalletWithName = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await sequelize.query(
    "select idWallet " +
      "from Wallet,WalletType " +
      "where Wallet.WalletType_idWalletType = WalletType.idWalletType and " +
      "Wallet.Account_email = :email and WalletType.type = :type",
    {
      type: QueryTypes.SELECT,
      replacements: { email: req.user._email, type: req.params.type },
    }
  );
  if (dataResult == null || dataResult.length == 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Id wallet of email:${req.user._email} and type:${req.params.type} not found`,
      })
    );
  }
  //console.log(dataResult[0].idWallet);
  const resultDeleteBudget = await Budget.destroy({
    where: { WalletIdWallet: dataResult[0].idWallet },
  });
  const resultDeteleTransaction = await Transaction.destroy({
    where: { WalletIdWallet: dataResult[0].idWallet },
  });
  const resultDeleteWallet = await Wallet.destroy({
    where: { idWallet: dataResult[0].idWallet },
  });
  if (
    resultDeleteWallet == 1 &&
    resultDeteleTransaction == 1 &&
    resultDeleteBudget == 1
  ) {
    return res.status(200).json(
      new SuccessResponse(200, {
        message: "Deleted Wallet successfully",
      })
    );
  } else {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: "Cannot delete wallet. something was wrong !!",
      })
    );
  }
});

exports.updateWalletWithName = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await sequelize.query(
    "select * " +
      "from Wallet,WalletType " +
      "where Wallet.WalletType_idWalletType = WalletType.idWalletType and " +
      "Wallet.Account_email = :email and WalletType.type = :type",
    {
      type: QueryTypes.SELECT,
      replacements: { email: req.user._email, type: req.params.type },
    }
  );
  if (dataResult == null || dataResult.length == 0) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: `Id wallet of email:${req.user._email} and type:${req.params.type} not found`,
      })
    );
  }
  console.log(dataResult);
  console.log(req.body.amount);
  if (req.body.amount) dataResult[0].amount = req.body.amount;
  const resultUpdate = await Wallet.update(
    { amount: dataResult[0].amount },
    {
      where: { idWallet: dataResult[0].idWallet },
    }
  );
  if (resultUpdate == 1) {
    return res.status(200).json(
      new SuccessResponse(200, {
        message: "Updated Wallet successfully",
      })
    );
  } else {
    return res.status(400).json(
      new ErrorResponse(400, {
        message: `Cannot Update wallet, Something is wrong or data is the same with data before update`,
      })
    );
  }
});
