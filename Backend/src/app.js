const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const config = require("./config/config");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:config.CLIENT_URL,
    credentials: true
}))

// requires all the route

const authRouter = require("./routes/auth.Routes");
const interviewRouter = require("./routes/interview.routes");

// using all the route
app.use("/api/auth", authRouter);
app.use("/api/interview",interviewRouter);

module.exports = app;