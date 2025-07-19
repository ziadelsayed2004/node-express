const asyncWrapper = require("../middlewares/asyncWrapper");
const userModel = require('../models/userModel');
const httpMsg = require('../utils/httpMsg');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req,res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await userModel.find({}, {"__v": false, 'password': false}).limit(limit).skip(skip);
    res.json({ status: httpMsg.SUCCESS, data: {users}});
})

const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;
    const oldUser = await userModel.findOne({ email: email});
    if(oldUser) {
        const error = appError.create('user already exists', 400, httpMsg.FAIL)
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    })

    const token = await generateJWT({email: newUser.email, _id: newUser._id, role: newUser.role});
    newUser.token = token;
    await newUser.save();
    res.status(201).json({status: httpMsg.SUCCESS, data: {user: newUser}})
})

const login = asyncWrapper(async (req, res, next) => {
    const {email, password} = req.body;
    if(!email && !password) {
        const error = appError.create('email and password are required', 400, httpMsg.FAIL)
        return next(error);
    }

    const user = await userModel.findOne({email: email});
    if(!user) {
        const error = appError.create('user not found', 400, httpMsg.FAIL)
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if(user && matchedPassword) {
       const token = await generateJWT({email: user.email, _id: user._id, role: user.role});

        return res.json({ status: httpMsg.SUCCESS, data: {token}});
    } else {
        const error = appError.create('something wrong', 500, httpMsg.ERROR)
        return next(error);
    }
})

module.exports = {
    getAllUsers,
    register,
    login
}