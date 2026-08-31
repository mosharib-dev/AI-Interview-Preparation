const multer = require("multer");
const config = require("../config/config");

const isProduction = config.NODE_ENV === "production";

/**
 * 404 handler — must be registered AFTER all routes, BEFORE the error handler.
 */
function notFoundHandler(req, res, next) {
    res.status(404).json({
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
}

/**
 * Centralized error handler.
 * With Express 5, rejected promises inside async route handlers are
 * automatically forwarded here via next(err) — no need to wrap every
 * controller in try/catch, but we DO need this middleware or Express
 * falls back to its default HTML error page (which can leak stack traces).
 */
function errorHandler(err, req, res, next) {
    // Multer-specific errors (file too large, unexpected field, etc.)
    if (err instanceof multer.MulterError) {
        const messages = {
            LIMIT_FILE_SIZE: "The uploaded file is too large. Maximum allowed size is 5MB.",
            LIMIT_UNEXPECTED_FILE: "Unexpected file field. Please upload your resume using the correct field.",
        };
        return res.status(400).json({
            message: messages[err.code] || "File upload failed.",
        });
    }

    // Malformed JSON body sent by the client.
    // NOTE: must be checked BEFORE the generic `err.statusCode` branch below —
    // Express's body-parser JSON errors also carry a `.statusCode` (400),
    // so this branch would otherwise be unreachable and every malformed
    // JSON request would leak the raw "Unexpected token..." parser message.
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Malformed JSON in request body." });
    }

    // Custom errors thrown with a statusCode (see httpError helper below)
    if (err.statusCode) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    // Invalid MongoDB ObjectId in a route param (e.g. /report/not-a-real-id)
    if (err.name === "CastError") {
        return res.status(400).json({ message: `Invalid ${err.path}: "${err.value}".` });
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        const details = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            message: "Validation failed.",
            details,
        });
    }

    // Mongo duplicate key errors (race conditions on unique fields)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || "field";
        return res.status(409).json({
            message: `An account with this ${field} already exists.`,
        });
    }

    // Fallback: unexpected server error
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        message: "Something went wrong on our end. Please try again shortly.",
        // Only leak stack traces outside production, to help local debugging
        ...(isProduction ? {} : { stack: err.stack, error: err.message }),
    });
}

/**
 * Small helper to throw an error with an HTTP status code attached,
 * so controllers can do: throw httpError(404, "Report not found")
 * and let the centralized handler format the response.
 */
function httpError(statusCode, message) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

module.exports = { notFoundHandler, errorHandler, httpError };
