const passport = require("passport");
const GoogleStrategy = require("passport-google").Strategy;
const serverless = require("serverless-http");
const express = require('express');
const cookieParser = require("cookie-parser");

const app = express();
  
app.get(`/`, function(req, res) {
    res.render("Test");
});


exports.handler = serverless(app);