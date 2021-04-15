const router = require("express").Router();
const BudgetController = require("../controllers/BudgetController");
const BudgetValidation = require("../Validator/BudgetValidator");
const { route } = require("./WalletRoute");

router.get(
  "/all-budget/:idWallet",
  BudgetValidation.getListBudgetValidation,
  BudgetValidation.result,
  BudgetController.getListBudgetOfWallet
);

router.get(
  "/info-budget/:idBudget",
  BudgetValidation.getInfoBudgetValidation,
  BudgetValidation.result,
  BudgetController.getInfoBudget
);

router.post(
  "/create-budget",
  BudgetValidation.createNewBudgetValidation,
  BudgetValidation.result,
  BudgetController.createNewBudget
);

module.exports = router;
