const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require("../utils/dbConnection")

const messages = sequelize.define(
    'messages',{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userId:{
            type: DataTypes.STRING,
            allowNull:false
        },
        messageContent:{
            type: DataTypes.STRING,
            allowNull:false,
        }
        }
)


module.exports = messages