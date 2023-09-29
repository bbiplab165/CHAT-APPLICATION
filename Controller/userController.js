const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body
        console.log(name, email, phone, password);
        if (!name || !email || !phone || !password) {
            return res.status(200).json({ message: "Please enter all the filds" })
        }
        const userData = await userModel.findAll({ where: { email: email } })
        if (userData.length > 0) {
            return res.status(200).json({ message: "user already exists" })
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            await userModel.create({
                name, email, phone, password: hash
            })
        })
        return res.status(200).json({ message: "user Created" })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await userModel.findOne({ where: { email } })
        // console.log(userData.password);
        if (!userData) {
            return res.status(404).json({ message: "User not found" })
        }
        else {
            console.log(userData);
            bcrypt.compare(password, userData.password, (err, result) => {
                if (result) {
                    console.log("done");
                    const userId = userData.id
                    const token = jwt.sign({ userId: userId }, "hello")
                    console.log(token);
                    return res.status(200).json({ message: "login successfull", token: token ,userName:userData.name,userId:userData.id})
                }
                else if (err) {
                    return res.status(401).json({ message: "User not authorized" })
                }
            })
        }

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" })
    }
}