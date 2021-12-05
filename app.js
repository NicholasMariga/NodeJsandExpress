//import express from "express";
 const express = require('express');
//import { chalk } from 'chalk';
const debug = require('debug')('app');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//import path from "path";
const path = require('path');
//const __dirname = path.resolve();
//import morgan from "morgan";
const morgan = require('morgan');
// import { readFile } from "fs/promises";
// const sessions = JSON.parse(await readFile("./src/data/sessions.json"));



const PORT = process.env.PORT || 3000;
//instance
const app = express();

const sessionsRouter = require('./src/routers/sessionsRouter');
const adminRouter = require('./src/routers/adminRouter');
const authRouter = require('./src/routers/authRouter');

//middleware
//morgan listens and console all the traffic
//app.use(morgan('combined'));
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({secret: "globomantics-clone"}));
//setting passport
require('./src/config/passport.js')(app);

//allows us to set variables
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use('/sessions', sessionsRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get("/", (req, res) => {
  //res.send('Hello am learning node and express');
  res.render("index", { title: "Globomantics" ,data: ['a','b','c'] });
});

//listeniing to the port
app.listen(PORT, () => {
  //console.log(`Listening on port ${green('3000')}`);
  console.log("Listening on port " + PORT);
  //debug only runs in debug mode
  //debug('Listening on port 3000');
});
