const WalletType = require("../database/models/WalletType");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");
const sequelize = require("../database/Db_connection");
const { QueryTypes } = require("sequelize");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");

exports.getListWalletType = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await WalletType.findAll();
  if (dataResult == null || dataResult.length == 0) {
    return res
      .status(404)
      .json(new ErrorResponse(404, { message: "List Wallet type is Empty!!" }));
  }
  return res.status(200).json(new SuccessResponse(200, { result: dataResult }));
});

exports.createNewWalletType = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await WalletType.create({
    type: req.body.type,
  });
  if (dataResult == null) {
    return res.status(500).json(
      new ErrorResponse(500, {
        message: "Can't create new Wallet Type, something was wrong !!",
      })
    );
  }
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create new Wallet Type successfully !!",
      newObject: dataResult,
    })
  );
});

exports.deleteWalletType = AsyncMiddleware(async (req, res, next) => {
  //check xem các bảng khác có chứa id wallet type ko r ms cho xoá=> lam trong validation pleas
  const deleteResult = await WalletType.destroy({
    where: { idWalletType: req.params.idWalletType },
  });
  if (deleteResult == 1)
    return res.status(200).json(
      new SuccessResponse(200, {
        message: "Delete Wallet Type successfully !!",
      })
    );
  return res.status(500).json(
    new ErrorResponse(500, {
      message: "Can't Delete Wallet Type, Something was wrong !!",
    })
  );
});

exports.updateWalletType = AsyncMiddleware(async (req, res, next) => {
  const dataBefore = await WalletType.findByPk(req.params.idWalletType);
  if (req.body.type) dataBefore.type = req.body.type;
  const updateResult = await WalletType.update(
    { type: dataBefore.type },
    {
      where: { idWalletType: dataBefore.idWalletType },
    }
  );
  if (updateResult == 1) {
    return res.status(200).json(
      new SuccessResponse(200, {
        message: "Update Wallet type Successfully !!",
        updateObejct: dataBefore,
      })
    );
  }
  return res.status(500).json(
    new ErrorResponse(500, {
      message:
        "Can't Update WalletType, Something was wrong or data is the same with data before udpate",
    })
  );
});
