const passport = require("passport");
const GoogleStrategy = require("passport-google").Strategy;
const serverless = require("serverless-http");
const express = require('express');
const cookieParser = require("cookie-parser");

exports.handler = serverless(app);


const app = express();

app.use(cookieParser());
app.use(
    sessions({
        cookieName: "session",
        secret: process.env.SESSION_SECRET,
        cookie: {
            ephemeral: false,
            secure: false
        }
    })
);

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
  
app.get(`https://distracted-montalcini-ba1430.netlify.com/auth/google`, passport.authenticate('google', { session: false }));
app.get(`https://distracted-montalcini-ba1430.netlify.com/auth/google/callback`,
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    handleCallback(),
);