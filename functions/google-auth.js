const passport = require("passport");
const GoogleStrategy = require("passport-google").Strategy;

passport.initialize();
passport.session();

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