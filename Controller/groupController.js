const groupModel = require("../models/groupModel")
const memberModel = require("../models/memberModel")

exports.createGroup = async (req, res) => {
    try {
        const userId = req.userId
        const groupName = req.body.name
        // const length = groups.length;
        const members = 1
        await groupModel.create({ name: groupName, members: members, userId })
        const groups = await groupModel.findOne({ where: { name: groupName } });
        const groupId = groups.id
        await memberModel.create({ userId, groupId, admin: true })
        return res.status(201).json({ message: "Group craeted" })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err })
    }
}
exports.getGroups = async (req, res) => {
    try {
        const userId = req.userId
        const groups = await groupModel.findAll({ where: { userId } })
        return res.status(201).json({ message: "Group craeted", groups: groups })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err })
    }
}
exports.joinedGroups = async (req, res) => {
    try {
        const userId = req.userId
        const groupName = []
        const groups = await memberModel.findAll({ where: { userId }, attributes: ["groupId", "id"] })
        for (const group of groups) {
            const groupInfo = await groupModel.findOne({
                where: { id: group.groupId }
            });

            if (groupInfo) {
                groupName.push({
                    id: groupInfo.id,
                    name: groupInfo.name,
                });
            }
        }
        return res.status(200).json({ message: "Group craeted", groups: groupName,user:userId})
    }
    catch (err) {
        return res.status(500).json({ message: err })
    }
}