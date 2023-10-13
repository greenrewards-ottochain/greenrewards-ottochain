const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./routes/userRoute");
const cookieParser = require('cookie-parser');
//const projectRoutes = require("./routes/projectRoutes");

const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
app.use(cookieParser());


//   Api Health Checker
app.get("/api/healthchecker", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to Green Reward",
    });
});

//userRoute router
app.use("/users", router);
// app.use("/projects", projectRoutes);


//Database connection
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err));


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
