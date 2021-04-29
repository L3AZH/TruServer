const Account = require("../database/models/Account");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const bcrypt = require("bcrypt");

async function hassPassword(password) {
  const salt = await bcrypt.genSalt(13);
  return bcrypt.hash(password, salt);
}

exports.register = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await Account.create({
    email: req.body.email,
    password: await hassPassword(req.body.password),
    username: req.body.username,
    phone: req.body.phone,
    joindate: new Date(),
  });
  return res
    .header("Authorization", "Bearer " + dataResult.generateToken())
    .status(200)
    .json(
      new SuccessResponse(200, {
        message: "Created Account Successfully !!",
        newObject: {
          email: dataResult.email,
          username: dataResult.username,
          phone: dataResult.phone,
          joindate: dataResult.joindate,
        },
      })
    );
});

exports.login = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await Account.findByPk(req.body.email);
  if (dataResult == null) {
    return res
      .status(400)
      .json(new ErrorResponse(400, { message: "Invalid email or password" }));
  } else {
    const validPassword = await bcrypt.compare(
      req.body.password,
      dataResult.password
    );
    if (!validPassword) {
      return res
        .status(400)
        .json(new ErrorResponse(400, { message: "Invalid email or password" }));
    }
    const token = dataResult.generateToken();
    return res
      .header("Authorization", "Bearer " + token)
      .status(200)
      .json(
        new SuccessResponse(200, {
          token,
          message: `Login successfull with email: ${dataResult.email}`,
        })
      );
  }
});
