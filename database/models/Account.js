const sequelize = require("../Db_connection");
const { DataTypes, Model } = require("sequelize");
const jwt = require("jsonwebtoken");

class Account extends Model {
  generateToken() {
    return jwt.sign({ _email: this.email }, process.env.DB_PRIVATEKEY);
  }
}

Account.init(
  {
    email: {
      primaryKey: true,
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(1024),
    },
    username: {
      type: DataTypes.STRING(50),
      field: "name",
    },
    phone: {
      type: DataTypes.STRING(12),
    },
    joindate: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "Account",
    modelName: "Account",
  }
);
module.exports = Account;
