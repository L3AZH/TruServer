const sequelize = require("../Db_connection")
const {DataTypes, Model} = require("sequelize")


class TransType extends Model{

}

TransType.init({
    idTransType:{
        primaryKey:true,
        allowNull:false,
        type:DataTypes.INTEGER,
        autoIncrement:true
    },
    type:{
        type:DataTypes.STRING(3)
    },
    categoryName:{
        type:DataTypes.STRING(50),
        field:"category_name"
    }
},{
    sequelize,
    modelName:"TransType",
    tableName:"TransType",
    timestamps:false
})


module.exports = TransType