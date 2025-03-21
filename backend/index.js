require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./database/connectDB");
const cookieParser = require("cookie-parser")
const errorHandler = require("./middlewares/errorHandler")
const router = require("./routes");
const session=require('express-session')
const http = require("http");
const { Server } = require("socket.io");
const { initializeSocket } = require("./socket");

const app = express();
connectDB()
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins, 
    credentials: true, 
}));
initializeSocket(server);
app.use(cookieParser())

app.use(router)


app.use(errorHandler)



app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));