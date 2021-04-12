const Wallet = require("../database/models/Wallet");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");

exports.getListWalletOfEmail = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await sequelize.query(
    "select Account_email,amount,type " +
      "from Wallet,WalletType " +
      "where Wallet.WalletType_idWalletType = WalletType.idWalletType and Wallet.Account_email = :email",
    { type: QueryTypes.SELECT, replacements: { email: req.user._email } }
  );
  if (dataResult == null) {
    return res.status(404).json(
      new ErrorResponse(404, {
        message: "List Wallet is empty on this account",
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

exports.deleteWalletWithName = AsyncMiddleware(async (req, res, next) => {});
