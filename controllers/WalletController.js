const Wallet = require("../database/models/Wallet");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");

exports.newWallet = AsyncMiddleware(async (req, res, next) => {
  const isWalletExist = await Wallet.findOne({
    where: {
      AccountEmail: req.body.email,
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
    AccountEmail: req.body.email,
    WalletTypeIdWalletType: req.body.idWalletType,
  });
  return res
    .status(200)
    .json(
      new SuccessResponse(200, { message: "Created Wallet successfully !!" })
    );
});
