const router = require("express").Router();
const WalletTypeValidation = require("../Validator/WalletTypeValidator");
const WalletTypeController = require("../controllers/WalletTypeController");
const AuthProtect = require("../middlewares/JwtAuth");

router.get("/get-all-wallettype", WalletTypeController.getListWalletType);

router.post(
  "/create-wallettype",
  AuthProtect,
  WalletTypeValidation.createNewWalletTypeValidation,
  WalletTypeValidation.result,
  WalletTypeController.createNewWalletType
);

router.delete(
  "/delete-wallettype/:idWalletType",
  AuthProtect,
  WalletTypeValidation.deleteWalletTypeValidation,
  WalletTypeValidation.result,
  WalletTypeController.deleteWalletType
);

router.put(
  "/update-wallettype/:idWalletType",
  AuthProtect,
  [
    WalletTypeValidation.updateWalletTypeParamValidation,
    WalletTypeValidation.updateWalletTypeBodyValidation,
  ],
  WalletTypeValidation.result,
  WalletTypeController.updateWalletType
);

module.exports = router;
