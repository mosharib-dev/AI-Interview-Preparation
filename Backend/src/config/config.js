const dotenv = require("dotenv");

dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("MongoDB URI is not defined in environment variable");
}

if(!process.env.JWT_SECRET) {
    throw new Error ("Jwt Secret not defined in environment variable");
}

if(!process.env.GOOGLE_GENAI_API_KEY) {
    throw new Error ("Gemini API Key not defined in environment variable");
}

const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_GENAI_API_KEY : process.env.GOOGLE_GENAI_API_KEY
}

module.exports = config;