const router = require("express").Router();
const TransactionController = require("../controllers/TransactionController");
const TransactionValidator = require("../Validator/TransactionValidator");
const { route } = require("./WalletRoute");

router.get(
  "/all-transaction/:idWallet",
  TransactionValidator.getTransactionWithIdWalletValidation,
  TransactionValidator.result,
  TransactionController.getTransactionWithIdWallet
);

router.get(
  "/info-transaction/:idWallet/:idTransType",
  TransactionValidator.getTransactionWithIdWalletAndIdTypeValidation,
  TransactionValidator.result,
  TransactionController.getTransactionWithIdWalletAndIdType
);

router.post(
  "/create-transaction",
  TransactionValidator.createNewTransactionValidation,
  TransactionValidator.result,
  TransactionController.createNewTransaction
);

router.delete(
  "/delete-transaction/:idTransaction",
  TransactionValidator.deleteTransactionValidation,
  TransactionValidator.result,
  TransactionController.deleteTransaction
);

router.put(
  "/update-transaction/:idTransaction",
  [
    TransactionValidator.updateTransactionParamsValidation,
    TransactionValidator.updateTransactionBodyValidation,
  ],
  TransactionValidator.result,
  TransactionController.updateTransaction
);

module.exports = router;
