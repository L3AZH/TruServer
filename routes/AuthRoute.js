const AuthValidator = require("../Validator/AuthValidator");
const AuthController = require("../controllers/AuthController");
const router = require("express").Router();

router.post(
  "/register",
  AuthValidator.userRegisterValidation,
  AuthValidator.result,
  AuthController.register
);

router.post(
  "/login",
  AuthValidator.userLoginValidation,
  AuthValidator.result,
  AuthController.login
);

module.exports = router;
