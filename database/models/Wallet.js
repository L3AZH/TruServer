const { DataTypes, Model } = require("sequelize");
const sequelize = require("../Db_connection");
const Account = require("./Account");
const WalletType = require("./WalletType");
class Wallet extends Model {}

Wallet.init(
  {
    idWallet: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DOUBLE,
    },
    AccountEmail: {
      field: "Account_email",
      type: DataTypes.STRING(50),
      references: {
        model: Account,
        key: "email",
      },
    },
    WalletTypeIdWalletType: {
      field: "WalletType_idWalletType",
      type: DataTypes.INTEGER,
      references: {
        model: WalletType,
        key: "idWalletType",
      },
    },
  },
  {
    sequelize,
    tableName: "Wallet",
    modelName: "Wallet",
    timestamps: false,
  }
);
/*
    doi voi quan he one-to-many 
    vidu Account co nhieu Wallet thi khai bao association ben Wallet
*/
Account.hasMany(Wallet);
Wallet.belongsTo(Account);

WalletType.hasMany(Wallet);
Wallet.belongsTo(WalletType);

module.exports = Wallet;
