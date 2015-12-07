var GitHubStrategy = require('passport-github').Strategy;
var env = require('../env.js');

module.exports = function(passport){
  passport.use(new GitHubStrategy({
    clientID: env.clientID,
    clientSecret: env.clientSecret,
    callbackURL: env.callbackURL
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }));
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
}
