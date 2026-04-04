const {Sequelize,DataTypes} = require('sequelize');
const sequelize = require("../utils/dbConnection")



const archivedMessages = sequelize.define(
    'archivedMessages',{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        type:{
            type: DataTypes.STRING,
        },
        roomId:{
            type: DataTypes.STRING,
            allowNull:false,

        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        messageContent:{
            type: DataTypes.STRING,
            allowNull:false,
        }
        }
)


module.exports = archivedMessages