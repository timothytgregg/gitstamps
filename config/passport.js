var GitHubStrategy = require('passport-github').Strategy;
var User            = require('../models/user');
var env = require('../env.js');
var Profile = require("../models/profile");
var Functions = require("../db/schemaMethods")



module.exports = function(passport){
  passport.use(new GitHubStrategy({
    clientID: env.clientID,
    clientSecret: env.clientSecret,
    callbackURL: env.callbackURL
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
          Profile.findOne({'username': newUser.github.username}, function(err, profile){
            if(err) return err;

            if (profile){
              console.log(newUser.github.username + " already in the database")
              newUser.follows.push(profile)
              newUser.save(function(err){
                if(err) throw err;
                return done(null, newUser);
              })
              // followProfile(req.user._id,profile,res)
            }else{
              var git = Functions.setUp(token);
              Functions.checkGHUser(git, newUser.github.username).then(function(response){
                var newProfile = new Profile({'username': newUser.github.username, imageURL:response[0].owner.avatar_url}).save(function(err, newProfile){
                  if(!err){
                    console.log(newUser.github.username + " saved in the database")
                  }
                  newUser.follows.push(newProfile._id)
                  newUser.save(function(err){
                    if(err) throw err;
                    return done(null, newUser);
                  })
                })
              })
            }
          })
        }
      })
    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
}
