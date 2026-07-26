const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const tokenBlackListModel = require("../models/blacklist.model");

const isProduction = config.NODE_ENV === "production";

const cookieOptions = isProduction
    ? { httpOnly: true, secure: true, sameSite: "none" }
    : { httpOnly: true };

async function registerUserController (req,res){
    const { username, email, password} = req.body;

    if(!username || !email || !password )
    {
        return res.status(400).json({
            message : "Please Provide username , email and password"
        })
    }

    const isAlreadyRegistered = await userModel.findOne({
        $or: [ { username }, { email }]
    })

    if(isAlreadyRegistered) {
        return res.status(400).json({
            message:"Account already exist with this username or email"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hashPassword
    })

    const token = jwt.sign(
        {id: user._id, username:user.username},
        config.JWT_SECRET,
        {expiresIn : "1d"}
    )

    res.cookie("token",token,cookieOptions);

    res.status(201).json({
        message : "User Registered Successfully",
        user: {
            id: user._id,
            username: user.username,
            email:user.email
        }
    })
}


async function loginUserController (req,res) {

    const {email , password} = req.body;

    if(!email || !password){
        return res.status(401).json({
            message:"Please Enter email and Password"
        })
    }

    const user = await userModel.findOne({email});

    if(!user)
    {
        return res.status(401).json({
            message : "Email or Password is Incorrect"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if (!isPasswordValid) 
    {
        return res.status(401).json({
            message: "Email or Password is Incorrect",
        })
    }

    const token = jwt.sign(
        {id: user._id , username : user.username},
        config.JWT_SECRET,
        {expiresIn :"1d"}
    )

    res.cookie("token", token,cookieOptions);

    res.status(200).json({
        message: "LoggedIn Successfully",
        user :{
            id:user._id,
            email:user.email,
            username: user.username
        }
    })
}


async function logoutUserController(req, res) {
    const token = req.cookies.token;

    if(token) {
        await tokenBlackListModel.create({ token })
    }

    res.clearCookie("token",cookieOptions);
    res.status(200).json({
        message : "User LoggedOut Successfully"
    })
}


async function getMeController(req,res) {
    
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message : "User fetched successfully",
        user: {
            id : user._id,
            username : user.username,
            email: user.email
        }
    })
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
}