const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.initialize();
passport.session();

passport.use(new GoogleStrategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://distracted-montalcini-ba1430.netlify.com/.netlify/functions/callback",
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
        console.log(accessToken);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

exports.handler = function(event, context, callback) {
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ]
    })

    callback(null, {
        statusCode: 200,
        body: "Hello, World"
    });
}