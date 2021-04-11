const WalletController = require("../controllers/WalletController");
const WalletValidation = require("../Validator/WalletValidator");
const router = require("express").Router();

router.post(
  "/create-wallet",
  WalletValidation.createWalletValidation,
  WalletValidation.result,
  WalletController.newWallet
);

module.exports = router;
