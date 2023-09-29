const chatModel = require("../models/chatModel")
const userModel = require("../models/userModel")
const groupModel = require("../models/groupModel")

const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk")
const Sequelize = require('sequelize');

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

function uploadToS3(data) {
    let s3bucket = new AWS.S3({
        accessKeyId: 'AKIAQUTZN5O62EVXSPH4',
        secretAccessKey: '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'
    })
    let param = {
        Bucket: 'group-chatapp1',
        Key: data.originalname,
        Body: data.buffer,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(param, (err, response) => {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                console.log("Success ", response.Location);
                resolve(response.Location)
            }
        })
    })
}

exports.chat = async (req, res) => {
    try {
        const userId = req.userId;
        const message = req.body.message;
        const groupId = req.params.groupId;
        const group = await groupModel.findOne({ where: { id: groupId } });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        let messageData = {};

        if (req.files) {
            // if(req.body)
            console.log(req.files);
            const uploadedFile = req.files[0];
            const fileExtension = path.extname(uploadedFile.originalname);
            console.log(fileExtension);
            const fileUrl = await uploadToS3(uploadedFile)
            console.log(fileUrl);
            // Save the chat message to the database
            // await chatModel.create({ image:fileUrl, userId, groupId });
            messageData.image = fileUrl;
        }
        if (req.body.message) {
            messageData.message = req.body.message;
        }
        if (!messageData.message && !messageData.image) {
            return res.status(400).json({ message: "Message content missing" });
        }
        await chatModel.create({ ...messageData, userId, groupId });

        // await chatModel.create({message, userId, groupId });

        return res.status(200).json({ message: "Chat message sent" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err });
    }
};

exports.messages = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const messages = await chatModel.findAll({
            where: { groupId },
            attributes: ["currentTime","message", "userId", "id", "image"],
            limit: 5,  // Limit to 10 records
            order: [['id', 'DESC']] // Order by id in descending order
        })
        const messagesWithUserName = [];

        // Loop through messages and fetch user names from the user model
        for (const message of messages) {
            const user = await userModel.findOne({
                where: { id: message.userId },
                attributes: ["name"] // Assuming "name" is the user's name attribute in the user model
            });

            // If a user with that ID exists, add the user name to the message
            if (user) {
                messagesWithUserName.push({
                    currentTime: message.currentTime,
                    message: message.message,
                    userId: message.userId,
                    id: message.id,
                    image: message.image,
                    userName: user.name // Add the user's name
                });
            }
        }
        const reversedMessages = messagesWithUserName.reverse();
        return res.status(200).json({ message: "authorized", data: reversedMessages })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err })
    }
}