const Sequelize=require("sequelize")
const sequelize=require("../util/database")
const moment = require('moment');

const chat =sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    // userId:Sequelize.INTEGER,
    message:Sequelize.STRING,
    image:Sequelize.STRING,
    currentTime: {
        type: Sequelize.STRING,
        defaultValue: moment().format('HH:mm')
    }
})

module.exports=chat