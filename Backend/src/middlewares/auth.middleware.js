const jwt = require("jsonwebtoken");
const config = require("../config/config");
const tokenBlackListModel = require("../models/blacklist.model");

async function authUser(req,res,next) {
    
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "Token not provided"
        })
    }

    const isTokenBlackListed = await tokenBlackListModel.findOne({ token });

    if(isTokenBlackListed)
    {
        return res.status(401).json({
            message : "User already logout"
        })
    }


    try {
        const decoded = jwt.verify(token,config.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err) {
        return res.status(401).json({
            message : "Invalid Token"
        })
    }
}

module.exports = { authUser};

