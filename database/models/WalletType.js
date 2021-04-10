const sequelize = require("../Db_connection");
const { DataTypes, Model } = require("sequelize");

class WalletType extends Model {}

WalletType.init(
  {
    idWalletType: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING(45),
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "WalletType",
    tableName: "WalletType",
  }
);

module.exports = WalletType;
