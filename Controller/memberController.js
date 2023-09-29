const memberModel = require("../models/memberModel")
const userModel = require("../models/userModel")

exports.members = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const members = await memberModel.findAll({ where: { groupId } })
        const memberDetails = [];

        // Loop through members and fetch user information for each userId
        for (const member of members) {
            const userId = member.userId;
            const user = await userModel.findOne({ where: { id: userId } });
            memberDetails.push({
                id: user.id,
                userId: user.id,
                username: user.name,
                isAdmin: member.admin
            });
        }
        return res.status(200).json({ data: memberDetails });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err })
    }
}

exports.addParticipant = async (req, res) => {
    try {
        const data = req.body
        const userId = req.userId
        const phone = data.phone
        const groupId = data.groupId

        if (phone.length < 10) {
            // console.log("dhffh");
            return res.status(404).json({ message: "Please enter a valid Phone Number" });
        }
        const user = await userModel.findOne({ where: { phone } })
        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }
        const newUser = user.id
        const userDetail = await memberModel.findOne({ where: { userId } })

        if (userDetail.admin === false) {
            return res.status(404).json({ message: "You are not authorised to add members" });
        }
        await memberModel.create({ groupId, userId: newUser, admin: false })
        return res.status(200).json({ message: "good", data: userDetail });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err })
    }
}
exports.removeParticipant = async (req, res) => {
    try {
        const groupId = req.body.groupId
        const userId = req.body.userId
        const accountUserId = req.userId
        const AcountMemberDetail = await memberModel.findOne({ where: { groupId, userId: accountUserId } })
        if (AcountMemberDetail.admin === false) {
            return res.status(400).json({ message: "Not Authorised" });
        }
        const memberDetail = await memberModel.findOne({ where: { groupId, userId } })
        await memberDetail.destroy();
        return res.status(200).json({ message: "user removed" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err })
    }
}

exports.makeAdmin = async (req, res) => {
    try {
        const groupId = req.body.groupId
        const userId = req.body.userId
        const accountUserId = req.userId
        const AcountMemberDetail = await memberModel.findOne({ where: { groupId, userId: accountUserId } })
        console.log(AcountMemberDetail.admin);
        if (AcountMemberDetail.admin === false) {
            return res.status(401).json({ message: "Not Authorised" });
        }
        const memberDetail = await memberModel.findOne({ where: { groupId, userId } })
        console.log(memberDetail);
        if (memberDetail.admin === true) {
            return res.status(400).json({ message: "Already admin" });
        }
        await memberModel.update({ admin: true }, { where: { groupId, userId } })
        return res.status(200).json({ message: "user updated" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err })
    }
}