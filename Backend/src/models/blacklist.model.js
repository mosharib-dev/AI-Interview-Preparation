const mongoose = require("mongoose")

const blackListTokenSchema = new mongoose.Schema({
    token : {
        type: String,
        required: [true, "Token is required to be added in blacklist"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // BUG FIX: this collection had no TTL, so blacklisted tokens
        // (added on every logout) accumulated forever. JWTs are issued
        // with a 1-day expiry, so a blacklisted token is useless to check
        // against after that point anyway — auto-expire it from Mongo at
        // the same time to keep this collection bounded.
        expires: 60 * 60 * 24 // seconds, matches JWT `expiresIn: "1d"`
    }
},{
    timestamps: true
})

const tokenBlackListModel = mongoose.model("blackListTokens",blackListTokenSchema);

module.exports = tokenBlackListModel;
