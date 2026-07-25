const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = express.Router();

// post request for register a new user

authRouter.post("/register",authController.registerUserController);

// Post request for login

authRouter.post("/login",authController.loginUserController);

// Get request for logout

authRouter.get("/logout",authController.logoutUserController);

// get request for get-me

authRouter.get("/getme",authMiddleware.authUser,authController.getMeController);



module.exports = authRouter;