const Sequelize=require("sequelize")
const sequelize=require("../util/database")

const member=sequelize.define('member',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:true
    },
    groupId:Sequelize.INTEGER,
    userId:Sequelize.INTEGER,
    admin:Sequelize.BOOLEAN
});
module.exports=member