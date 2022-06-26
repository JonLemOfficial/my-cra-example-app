const { join } = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require('passport');

const apiRouter = require("./router");
const passportConfig = require("./config/passport.config.js");
const corsConfig = require("./config/cors.config.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('my-cra-app'));
app.use(corsConfig());
app.use(passportConfig(passport).initialize());
app.use("/api", apiRouter);

module.exports = app;
