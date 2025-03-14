require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./database/connectDB");
const cookieParser = require("cookie-parser")
const errorHandler = require("./middlewares/errorHandler")
const router = require("./routes");

const app = express();
app.use(cors());

connectDB()

const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins, 
    credentials: true, 
}));

app.use(cookieParser())

app.use(router)


app.use(errorHandler)



app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));