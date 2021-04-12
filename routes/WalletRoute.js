const WalletController = require("../controllers/WalletController");
const WalletValidation = require("../Validator/WalletValidator");
const AuthProtection = require("../middlewares/JwtAuth");
const router = require("express").Router();

router.post(
  "/create-wallet",
  AuthProtection,
  WalletValidation.createWalletValidation,
  WalletValidation.result,
  WalletController.newWallet
);

router.get(
  "/me-all-wallet",
  AuthProtection,
  WalletController.getListWalletOfEmail
);

module.exports = router;
