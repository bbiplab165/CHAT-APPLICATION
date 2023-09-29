const express = require('express')

const userController = require('../Controller/userController')
const chatController = require("../Controller/chatController")
const groupModel = require("../Controller/groupController")
const memberController = require("../Controller/memberController")
const middle = require("../middleware/middle")

const router = express.Router()

router.post('/createUser', userController.createUser)
router.post('/login', userController.login)

router.post('/chat/:groupId', middle.authenticate, chatController.chat)
router.get('/messages/:groupId', chatController.messages)

router.post('/createGroup', middle.authenticate, groupModel.createGroup)
router.get('/getGroups', middle.authenticate, groupModel.getGroups)
router.get('/joinedGroups', middle.authenticate, groupModel.joinedGroups)
// router.get('/loginGroup/:id',groupModel.loginGroup)

router.get('/members/:groupId', memberController.members)
router.post('/addParticipant', middle.authenticate, memberController.addParticipant)
router.post('/removeParticipant', middle.authenticate, memberController.removeParticipant)
router.post('/makeAdmin', middle.authenticate, memberController.makeAdmin)

module.exports = router 