const createError = require("http-errors");
const express = require('express');
const cors = require('cors');
const session = require("express-session");
const passport = require("passport");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const { ObjectId } = require('mongodb');
require('dotenv').config();


const indexRouter = require('./routes/index');
const messagingAppRouter = require('./routes/messagingApp');

const RateLimit = require("express-rate-limit");

const initializePassport = require("./passportAuth");

// Mongo / Mongoose (your existing DB)
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGO_URI;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// ---------------- EXPRESS APP ----------------
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

// ---------------- MIDDLEWARE ----------------
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
});
app.use(limiter);
app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

initializePassport();
app.use(session({
  secret: process.env.PASSPORT_PASSWORD,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// ---------------- ROUTES ----------------
app.use('/', indexRouter);
app.use("/messagingApp", messagingAppRouter);


// ---------------- ERROR HANDLING ----------------
app.use((err, req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

// ---------------- SERVER START ----------------
const port = process.env.PORT || 3000;

server.listen(port, "0.0.0.0", function () {
  console.log(`Server running on port ${port}`);
});

module.exports = app;