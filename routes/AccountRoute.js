const AccountController = require("../controllers/AccountController");
const AuthProtect = require("../middlewares/JwtAuth");
const router = require("express").Router();

router.get("/me", AuthProtect, AccountController.getCurrentAccountInfo);

router.post("/update", AuthProtect, AccountController.udpateCurrentAccountInfo);

module.exports = router;
