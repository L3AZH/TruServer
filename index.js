const express = require("express");
const swaggerDoc = require("./swagger.json");
const swaggerUI = require("swagger-ui-express");
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
const TransactionRouter = require("./routes/TransactionRoute");
const BudgetRouter = require("./routes/BudgetRoute");
const WalletTypeRouter = require("./routes/WalletTypeRoute");
const TransTypeRouter = require("./routes/TransTypeRoute");
const errorHandler = require("./middlewares/ErrorHandler");
const cors = require("cors");
app.use(express.json());
app.use(cors());
sequelize.sync();
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use("/api/auth", AuthRouter);
app.use("/api/account", AccountRouter);
app.use("/api/account/wallet", WalletRouter);
app.use("/api/account/wallet/transaction", TransactionRouter);
app.use("/api/account/wallet/budget", BudgetRouter);
app.use("/api/wallettype", WalletTypeRouter);
app.use("/api/transtype", TransTypeRouter);
app.use(errorHandler);
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
//       await Account.findByPk("lamhatuananh1@gmail.com", {
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
