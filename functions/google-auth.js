const passport = require("passport");
const GoogleStrategy = require("passport-google").Strategy;
const serverless = require("serverless-http");
const express = require('express');
const cookieParser = require("cookie-parser");

const app = express();
  
app.get(`https://distracted-montalcini-ba1430.netlify.com/.netlify/functions/google-auth`, function(req, res) {
    console.log("passed");
    res.render("Test");
});


exports.handler = serverless(app);