const express = require('express');
const route = require('./routes/route');
const cors = require('cors');
const multer = require('multer');
const moment = require('moment');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const http = require('http');
const Server = require('socket.io');
const chatModel = require('./models/chatModel');
const groupModel = require('./models/groupModel');
const userModel = require('./models/userModel');

const app = express();
app.use(multer().any());
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    allowCredentials: true,
}));

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
};

const io = Server(server, {
    cors: corsOptions,
});

app.use('/', route);

userModel.hasMany(groupModel);
groupModel.hasMany(userModel);
userModel.hasMany(chatModel);
chatModel.belongsTo(userModel);
chatModel.belongsTo(groupModel);
groupModel.hasMany(chatModel);

sequelize.sync().then(() => {
    console.log('Database synchronized');
}).catch((err) => console.log(err));

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('chat-message', ({ message, groupId, userId, userName }) => {
        const currentTime = moment().format('HH:mm');
        io.emit('message', { message, userId, userName, currentTime });
        console.log(`Sent message to group ${groupId}: ${message} token: ${userId}`);
    });
    socket.on("image", ({ image, groupId, userId, userName }) => {
        const currentTime = moment().format('HH:mm');
        io.emit('image', { image, userId, userName, currentTime });
        console.log(`Sent image to group ${groupId}: token: ${userId}`);
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => {
    console.log('App running on port 3000');
});
