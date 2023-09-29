const express = require('express')
const route = require('./routes/route')
const cors = require('cors');
const bodyParser = require('body-parser')
const sequelize = require("./util/database")

const http = require('http');
const socketIo = require('socket.io');
//------------  controllers  --------------
const chatModel = require("./models/chatModel")
const groupModel = require("./models/groupModel")
const userModel = require("./models/userModel")
const memberModel = require("./models/memberModel")

const app = express()
const server = http.createServer(app);
// const io = socketIo(server);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    allowCredentials: true,
}));
app.use('/socket.io/', cors({
    origin: 'http://localhost:5173',
    allowCredentials: true,
}));
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST'],
};

const io = socketIo(server, {
    cors: corsOptions,
});

app.use('/', route)

userModel.hasMany(groupModel)
groupModel.hasMany(userModel)


userModel.hasMany(chatModel)
chatModel.belongsTo(userModel)

chatModel.belongsTo(groupModel)
groupModel.hasMany(chatModel)


// sequelize.sync().then(app.listen(3000,function(){
//     console.log('App running on port 3000');
// }))
sequelize.sync().then(() => {
    console.log('Database synchronized');
})
    .catch((err) => console.log(err))

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => {
    console.log('App running on port 3000');
});