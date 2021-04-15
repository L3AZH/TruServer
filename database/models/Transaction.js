const sequelize = require("../Db_connection");
const { DataTypes, Model } = require("sequelize");
const Wallet = require("./Wallet");
const TransType = require("./TransType");

class Transaction extends Model {}

Transaction.init(
  {
    idTransaction: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    //khoangoaiphai ghi bat dau bang chu Hoa va phai giong vs name table trong db
    /*
        vidu: 
        tablename: Wallet_idWallet => WalletIdWallet
    */
    WalletIdWallet: {
      field: "Wallet_idWallet",
      type: DataTypes.INTEGER,
      references: {
        model: Wallet,
        key: "idWallet",
      },
    },
    TransTypeIdTransType: {
      field: "TransType_idTransType",
      type: DataTypes.INTEGER,
      references: {
        model: TransType,
        key: "idTransType",
      },
    },
    amount: {
      type: DataTypes.DOUBLE,
    },
    note: {
      type: DataTypes.STRING(100),
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "Transaction",
    timestamps: false,
  }
);

/*
    Bang nay la the hien moi quan he many-to-many cua wallet-trantype nen phai khai bao associations
    neu khong bao accossiaon se bao loi thieu id field
*/
Wallet.belongsToMany(TransType, { through: "Transaction" });
TransType.belongsToMany(Wallet, { through: "Transaction" });

module.exports = Transaction;
