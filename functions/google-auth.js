const passport = require("passport");
const GoogleStrategy = require("passport-google").Strategy;
const cookie = require("cookie");

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

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

passport.initialize();
passport.session();

exports.handler = async (event, context, callback) => {
    //passport.authenticate("google");
    console.log("APPARENTLY THIS IS SUPPOSED TO WORK.");
    callback(null, {
        statusCode: 200,
        body: "Testing..."
    });
};