const router = require("express").Router();
const WalletTypeValidation = require("../Validator/WalletTypeValidator");
const WalletTypeController = require("../controllers/WalletTypeController");

router.get("/get-all-wallettype", WalletTypeController.getListWalletType);

router.post(
  "/create-wallettype",
  WalletTypeValidation.createNewWalletTypeValidation,
  WalletTypeValidation.result,
  WalletTypeController.createNewWalletType
);

router.delete(
  "/delete-wallettype/:idWalletType",
  WalletTypeValidation.deleteWalletTypeValidation,
  WalletTypeValidation.result,
  WalletTypeController.deleteWalletType
);

router.put(
  "/update-wallettype/:idWalletType",
  [
    WalletTypeValidation.updateWalletTypeParamValidation,
    WalletTypeValidation.updateWalletTypeBodyValidation,
  ],
  WalletTypeValidation.result,
  WalletTypeController.updateWalletType
);

module.exports = router;
