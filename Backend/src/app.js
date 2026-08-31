const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const config = require("./config/config");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(cors({
    origin:config.CLIENT_URL,
    credentials: true
}))

// simple health check for uptime monitors / load balancers
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// requires all the route

const authRouter = require("./routes/auth.Routes");
const interviewRouter = require("./routes/interview.routes");

// using all the route
app.use("/api/auth", authRouter);
app.use("/api/interview",interviewRouter);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// centralized error handler — MUST be registered last
app.use(errorHandler);

module.exports = app;