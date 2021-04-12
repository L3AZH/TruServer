const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const Account = require("../database/models/Account");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");
const bcrypt = require("bcrypt");

async function hassPassword(password) {
  const salt = await bcrypt.genSalt(13);
  return bcrypt.hash(password, salt);
}

exports.getCurrentAccountInfo = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await Account.findByPk(req.user._email);
  const infoShow = {
    email: dataResult.email,
    username: dataResult.username,
    phone: dataResult.phone,
    joindate: dataResult.joindate,
  };
  return res.status(200).json(new SuccessResponse(200, { infoShow }));
});

exports.udpateCurrentAccountInfo = AsyncMiddleware(async (req, res, next) => {
  const dataBeforeUpdate = await Account.findByPk(req.user._email);
  if (req.body.password)
    dataBeforeUpdate.password = await hassPassword(req.body.password);
  if (req.body.username) dataBeforeUpdate.username = req.body.username;
  const dataResult = await Account.update(
    {
      username: dataBeforeUpdate.username,
      password: dataBeforeUpdate.password,
    },
    {
      where: { email: dataBeforeUpdate.email },
    }
  );
  if (dataResult == 1) {
    return res
      .status(200)
      .json(new SuccessResponse(200, { message: "Update info successful !!" }));
  } else {
    return res.status(400).json(
      new ErrorResponse(400, {
        message: "Update false, something was wrong !!",
        result: dataBeforeUpdate,
      })
    );
  }
});
