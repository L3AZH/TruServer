const TransType = require("../database/models/TransType");
const AsyncMiddleware = require("../middlewares/AsyncMiddleware");
const sequelize = require("../database/Db_connection");
const { QueryTypes, json } = require("sequelize");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");

exports.getListTransType = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await TransType.findAll();
  if (dataResult == null || dataResult.length == 0) {
    return res
      .status(404)
      .json(new ErrorResponse(404, { message: "List TransType is Empty !!" }));
  }
  return res.status(200).json(new SuccessResponse(200, { result: dataResult }));
});

exports.createNewTransType = AsyncMiddleware(async (req, res, next) => {
  const dataResult = await TransType.create({
    type: req.body.type,
    categoryName: req.body.categoryName,
  });
  return res.status(200).json(
    new SuccessResponse(200, {
      message: "Create new TransType successfully !!",
      newObject: dataResult,
    })
  );
});

exports.deteletTransType = AsyncMiddleware(async (req, res, next) => {
  //check xem các bảng khác có chứa id trans type ko r ms cho xoá=> lam trong validation pleas
  const deleteResult = await TransType.destroy({
    where: { idTransType: req.params.idTransType },
  });
  if (deleteResult == 1)
    return res.status(200).json(
      new SuccessResponse(200, {
        message: "Delete Trans Type successfully !!",
      })
    );
  return res.status(500).json(
    new ErrorResponse(500, {
      message: "Can't Delete Trans Type, Something was wrong !!",
    })
  );
});

exports.udpateTransType = AsyncMiddleware(async (req, res, next) => {
  const dataBefore = await TransType.findByPk(req.params.idTransType);
  if (req.body.type) dataBefore.type = req.body.type;
  if (req.body.categoryName) dataBefore.categoryName = req.body.categoryName;
  const updateResult = await TransType.update(
    { type: dataBefore.type, categoryName: dataBefore.categoryName },
    { where: { idTransType: dataBefore.idTransType } }
  );
  if (updateResult == 1) {
    return res.status(200).json(
      new SuccessResponse(200, {
        message: "Update Trans type Successfully !!",
      })
    );
  }
  return res.status(500).json(
    new ErrorResponse(500, {
      message:
        "Can't Update TransType, Something was wrong or data is the same with data before udpate",
    })
  );
});
