const passport = require("passport");
const GoogleStrategy = require("passport-google").Strategy;
const serverless = require("serverless-http");
const express = require('express');
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
        returnURL: 'https://distracted-montalcini-ba1430.netlify.com/settings',
        realm: 'https://distracted-montalcini-ba1430.netlify.com/'
    },
    function(identifier, profile, done) {
        process.nextTick(function () {
        
        profile.identifier = identifier;
            return done(null, profile);
        });
    }
));

passport.serializeUser(
    (user, cb) => cb(user ? null : "null user", user)
);

passport.deserializeUser(
    (user, cb) => cb(user ? null : "null user", user)
);


const handleCallback = () => (req, res) => {
    res.cookie('jwt', req.user.jwt, { httpOnly: true, COOKIE_SECURE })
        .redirect('/');
};
  
app.get(`https://distracted-montalcini-ba1430.netlify.com/.netlify/functions/google-auth`, passport.authenticate('google', { session: false }));
app.get(`https://distracted-montalcini-ba1430.netlify.com/.netlify/functions/google-auth/callback`,
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    handleCallback(),
);


exports.handler = serverless(app);