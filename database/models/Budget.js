const sequelize = require("../Db_connection");
const { DataTypes, Model } = require("sequelize");
const Wallet = require("./Wallet");
class Budget extends Model {}

Budget.init(
  {
    idBudget: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    amountBudget: {
      type: DataTypes.DOUBLE,
    },
    note: {
      type: DataTypes.STRING(100),
    },
    date: {
      type: DataTypes.DATE,
    },
    WalletIdWallet: {
      field: "Wallet_idWallet",
      type: DataTypes.INTEGER,
      references: {
        model: Wallet,
        key: "idWallet",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Budget",
    tableName: "Budget",
  }
);

Wallet.hasMany(Budget);
Budget.belongsTo(Wallet);

module.exports = Budget;
