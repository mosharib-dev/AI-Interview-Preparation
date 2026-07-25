const mongoose = require("mongoose");
const config = require("./config");

async function connectToDB() {
   try {
        await mongoose.connect(config.MONGO_URI);
        console.log("DB Connected");
   }
   catch(err) {
     console.log(err);
   }
}

module.exports = connectToDB;