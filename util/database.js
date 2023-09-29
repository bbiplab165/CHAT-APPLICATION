const Sequelize=require('sequelize')

const sequelize=new Sequelize('group chat','root','MICROMAx1#',{
    host:'localhost',
    dialect:'mysql'
})

module.exports=sequelize