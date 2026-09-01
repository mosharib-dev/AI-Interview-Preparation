const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { createRateLimiter } = require("../middlewares/rateLimit.middleware");

const authRouter = express.Router();

// limit brute-force / credential-stuffing attempts on auth endpoints
const authRateLimiter = process.env.NODE_ENV === "test"
    ? (req, res, next) => next()
    : createRateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10,
        message: "Too many attempts. Please wait a few minutes and try again."
    });

// post request for register a new user

authRouter.post("/register",authRateLimiter,authController.registerUserController);

// Post request for login

authRouter.post("/login",authRateLimiter,authController.loginUserController);

// Get request for logout

authRouter.get("/logout",authController.logoutUserController);

// get request for get-me

authRouter.get("/getme",authMiddleware.authUser,authController.getMeController);



module.exports = authRouter;