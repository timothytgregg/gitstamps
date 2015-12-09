var GitHubStrategy = require('passport-github').Strategy;
var User            = require('../models/user');
// var env = require('../env.js');

module.exports = function(passport){
  passport.use(new GitHubStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackUrl
  }, function(token, secret, profile, done){
    process.nextTick(function(){
      User.findOne({'github.id': profile.id}, function(err, user){
        if(err) return done(err);

        // If the user already exists, just return that user.
        if(user){
          return done(null, user);
        } else {
          // Otherwise, create a brand new user using information passed from GH.
          var newUser = new User();
          // Here we're saving information passed to us from GH.
          newUser.github.id = profile.id;
          newUser.github.token = token;
          newUser.github.username = profile.username;
          newUser.github.displayName = profile.displayName;

          newUser.save(function(err){
            if(err) throw err;
            return done(null, newUser);
          })
        }
      })
    })
  }));

  // }, function(accessToken, refreshToken, profile, done) {
  //   process.nextTick(function() {
  //     console.log(profile)
  //     return done(null, profile);
  //   });
  // }));
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
}
