const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const tokenBlackListModel = require("../models/blacklist.model");
const { httpError } = require("../middlewares/error.middleware");

const isProduction = config.NODE_ENV === "production";

// Cross-site cookies (frontend and backend on different domains, which is
// the normal case for a deployed app — e.g. frontend on Vercel, backend on
// Render) REQUIRE `sameSite: "none"` + `secure: true`, or the browser will
// silently refuse to send the cookie on any fetch/XHR request that isn't a
// same-site top-level navigation. Relying solely on `NODE_ENV === "production"`
// is fragile — some hosting platforms don't set NODE_ENV unless you do it
// yourself — so we also treat any non-localhost CLIENT_URL as needing the
// cross-site-safe settings. If CLIENT_URL looks like localhost, we assume
// local development over plain HTTP and skip `secure`/`sameSite: "none"`
// (browsers reject Secure cookies on non-HTTPS origins).
const isLocalClient = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(config.CLIENT_URL || "");
const needsCrossSiteCookie = isProduction || !isLocalClient;

const cookieOptions = needsCrossSiteCookie
    ? { httpOnly: true, secure: true, sameSite: "none" }
    : { httpOnly: true };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials({ username, email, password }) {
    if (email && !EMAIL_REGEX.test(email)) {
        throw httpError(400, "Please provide a valid email address.");
    }
    if (password && password.length < 8) {
        throw httpError(400, "Password must be at least 8 characters long.");
    }
    if (username && (username.length < 3 || username.length > 30)) {
        throw httpError(400, "Username must be between 3 and 30 characters.");
    }
}

async function registerUserController (req,res){
    const { username, email, password} = req.body;

    if(!username || !email || !password )
    {
        return res.status(400).json({
            message : "Please Provide username , email and password"
        })
    }

    // BUG FIX: previously there was no server-side validation at all —
    // the HTML `required`/`type="email"` attributes are trivially bypassed
    // by calling the API directly, so bad data could reach the database.
    validateCredentials({ username, email, password });

    const isAlreadyRegistered = await userModel.findOne({
        $or: [ { username }, { email }]
    })

    if(isAlreadyRegistered) {
        return res.status(400).json({
            message:"Account already exist with this username or email"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // NOTE: there is a small race window between the findOne check above and
    // this create() call. We rely on the unique index on username/email plus
    // the centralized error handler's E11000 branch to catch that race
    // safely rather than crashing with a raw Mongo error.
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

    // BUG FIX: if the user tied to a still-valid JWT was deleted, `user`
    // was null here and `user._id` below would throw a raw TypeError
    // instead of a clean 401/404.
    if (!user) {
        throw httpError(404, "User not found. Your session may be stale — please log in again.");
    }

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
