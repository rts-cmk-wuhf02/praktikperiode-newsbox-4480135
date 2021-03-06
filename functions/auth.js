const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');
const serverless = require('serverless-http');

require('./utils/auth');

const {
    COOKIE_SECURE,
    ENDPOINT,
    BASE_URL
} = require('./utils/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

const handleCallback = () => (req, res) => {
    res.cookie('jwt', req.user.jwt, { httpOnly: false, path: "/", COOKIE_SECURE }).redirect('/');
};

app.get(`${ENDPOINT}/auth/github`, passport.authenticate('github', { session: false }));
app.get(
    `${ENDPOINT}/auth/github/callback`,
    passport.authenticate('github', { failureRedirect: '/', session: false }),
    handleCallback(),
);

app.get(
    `${ENDPOINT}/auth/status`,
    passport.authenticate('jwt', { session: false }),
    (req, res) => res.json({ email: req.user.email }),
);


console.log(`Completed Initialization`);


module.exports.handler = serverless(app);