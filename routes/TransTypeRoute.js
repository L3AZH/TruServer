const router = require("express").Router();
const TransTypeController = require("../controllers/TransTypeController");
const TransTypeValidation = require("../Validator/TransTypeValidator");
const { route } = require("./TransactionRoute");
const AuthProtect = require("../middlewares/JwtAuth");

router.get("/get-all-transtype", TransTypeController.getListTransType);

router.post(
  "/create-transtype",
  AuthProtect,
  TransTypeValidation.createNewTransTypeValidation,
  TransTypeValidation.result,
  TransTypeController.createNewTransType
);

router.delete(
  "/delete-transtype/:idTransType",
  AuthProtect,
  TransTypeValidation.deleteTransTypeValidation,
  TransTypeValidation.result,
  TransTypeController.deteletTransType
);

router.put(
  "/update-transtype/:idTransType",
  AuthProtect,
  [
    TransTypeValidation.updateTransTypeParamValidation,
    TransTypeValidation.updateTransTypeBodyValidation,
  ],
  TransTypeValidation.result,
  TransTypeController.udpateTransType
);

module.exports = router;
