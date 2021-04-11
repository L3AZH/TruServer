const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const sequelize = require("./database/Db_connection");
const Account = require("./database/models/Account");
const Transaction = require("./database/models/Transaction");
const TransType = require("./database/models/TransType");
const Wallet = require("./database/models/Wallet");
const WalletType = require("./database/models/WalletType");
const Budget = require("./database/models/Budget");
const AuthRouter = require("./routes/AuthRoute");
const AccountRouter = require("./routes/AccountRoute");
const WalletRouter = require("./routes/WalletRoute");
const errorHandler = require("./middlewares/ErrorHandler");
app.use(express.json());
app.use(errorHandler);
app.use("/api/auth", AuthRouter);
app.use("/api/account", AccountRouter);
app.use("/api/account/wallet", WalletRouter);
// async function testConnection(){
//     try{
//         await sequelize.authenticate()
//         console.log("connection has been established successfully")
//     }
//     catch(err){
//         console.error("unable to connection to the database: ",err)
//     }
// }

// testConnection()
// sequelize.sync()

// async function getlist() {
//   try {
//     console.log(
//       await Account.findByPk("lamhatuananh6@gmail.com", {
//         include: Wallet,
//       })
//     );
//     console.log(await Transaction.findAll());
//     console.log(
//       await WalletType.findByPk(1, {
//         include: Wallet,
//       })
//     );
//     console.log(
//       await Wallet.findByPk(1, {
//         include: Budget,
//       })
//     );
//   } catch (err) {
//     console.log(err);
//   }
// }
// getlist();

app.listen(port, () => console.log(`Server is running on port: ${port}`));
