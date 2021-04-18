const router = require("express").Router();
const BudgetController = require("../controllers/BudgetController");
const BudgetValidation = require("../Validator/BudgetValidator");
const AuthProtection = require("../middlewares/JwtAuth");
const { route } = require("./WalletRoute");

router.get(
  "/all-budget/:idWallet",
  AuthProtection,
  BudgetValidation.getListBudgetValidation,
  BudgetValidation.result,
  BudgetController.getListBudgetOfWallet
);

router.get(
  "/info-budget/:idBudget",
  AuthProtection,
  BudgetValidation.getInfoBudgetValidation,
  BudgetValidation.result,
  BudgetController.getInfoBudget
);

router.post(
  "/create-budget",
  AuthProtection,
  BudgetValidation.createNewBudgetValidation,
  BudgetValidation.result,
  BudgetController.createNewBudget
);

router.delete(
  "/delete-budget/:idBudget",
  AuthProtection,
  BudgetValidation.deleteBudgetValidation,
  BudgetValidation.result,
  BudgetController.deleteBudget
);

router.put(
  "/update-budget/:idBudget",
  AuthProtection,
  [
    BudgetValidation.updateBudgetParamValidation,
    BudgetValidation.updateBudgetParamValidation,
  ],
  BudgetValidation.result,
  BudgetController.updateBudget
);

module.exports = router;
