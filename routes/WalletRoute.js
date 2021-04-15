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

router.delete(
  "/delete-wallet/:type",
  AuthProtection,
  WalletValidation.deleteWalletWithNameValidation,
  WalletValidation.result,
  WalletController.deleteWalletWithName
);

router.put(
  "/update-wallet/:type",
  AuthProtection,
  [
    WalletValidation.updateWalletWithNameParamsValidation,
    WalletValidation.updateWalletWithNameBodyValidation,
  ],
  WalletValidation.result,
  WalletController.updateWalletWithName
);

module.exports = router;
