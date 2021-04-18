const router = require("express").Router();
const TransactionController = require("../controllers/TransactionController");
const TransactionValidator = require("../Validator/TransactionValidator");
const AuthProtection = require("../middlewares/JwtAuth");

router.get(
  "/all-transaction/:idWallet",
  AuthProtection,
  TransactionValidator.getTransactionWithIdWalletValidation,
  TransactionValidator.result,
  TransactionController.getTransactionWithIdWallet
);

router.get(
  "/info-transaction/:idWallet/:idTransType",
  AuthProtection,
  TransactionValidator.getTransactionWithIdWalletAndIdTypeValidation,
  TransactionValidator.result,
  TransactionController.getTransactionWithIdWalletAndIdType
);

router.post(
  "/create-transaction",
  AuthProtection,
  TransactionValidator.createNewTransactionValidation,
  TransactionValidator.result,
  TransactionController.createNewTransaction
);

router.delete(
  "/delete-transaction/:idTransaction",
  AuthProtection,
  TransactionValidator.deleteTransactionValidation,
  TransactionValidator.result,
  TransactionController.deleteTransaction
);

router.put(
  "/update-transaction/:idTransaction",
  AuthProtection,
  [
    TransactionValidator.updateTransactionParamsValidation,
    TransactionValidator.updateTransactionBodyValidation,
  ],
  TransactionValidator.result,
  TransactionController.updateTransaction
);

module.exports = router;
