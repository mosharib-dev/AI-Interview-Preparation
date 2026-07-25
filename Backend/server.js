const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();

const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log("Server is listen on ",port)
})
