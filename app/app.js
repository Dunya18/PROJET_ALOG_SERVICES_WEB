const express = require("express");
const dotenv = require("dotenv")
const bodyParser = require("body-parser")

// Routes
const loginRouter = require("./routes/clients/login.router");
const signupRouter = require("./routes/clients/signup.router");

// Configure dotenv
dotenv.config({
    path: ".env"
})

const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.static('uploads'));


// Parse data as json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Services WEB API is up and running!")
})
//// Apply routers

app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);


app.listen(app.get("port"), () => {
    console.log(`App is served under ${app.get("port")} port`);
})
