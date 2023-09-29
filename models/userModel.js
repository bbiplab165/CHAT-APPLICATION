const Sequelize=require('sequelize')
const sequelize=require('../util/database')


const userModel=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
    },
    email:{
        type:Sequelize.STRING
    },
    phone:{
        type: Sequelize.STRING(20)
    },
    password:{
        type:Sequelize.STRING
    },
    
})

module.exports=userModel