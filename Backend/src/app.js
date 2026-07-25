const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}))

// requires all the route

const authRouter = require("./routes/auth.Routes");
const interviewRouter = require("./routes/interview.routes");

// using all the route
app.use("/api/auth", authRouter);
app.use("/api/interview",interviewRouter);

module.exports = app;