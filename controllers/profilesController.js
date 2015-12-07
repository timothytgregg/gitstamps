var express = require("express");
var router = express.Router();
var Profile = require("../models/profile")
var Stamp = require("../models/stamp")

function error(response, message){
  response.status(500);
  response.json({error: message})
}

function authenticatedUser(req, res, next) {
  // If the user is authenticated, then we continue the execution
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

var profilesController = {
  getProfiles: function(req,res){
    Profile.find({}).populate("stamps").then(function(profiles){
      //response renders json of profiles
      res.json(profiles);
    });
  },
  getProfile: function(req,res){
    Profile.findById(req.params.id).populate("stamps").then(function(profile){
      res.json(profile);
    });
  },
  addProfile:function(req,res){
    new Profile(req.body).save().then(function(profile){
      // profile.createStamp();
      return profile;
    }).then(function(profile){
      res.json(profile);
    });
  },
  updateProfile:function(req,res){
    Profile.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).then(function(profile){
      res.json(profile);
    });
  },
  deleteProfile:function(req,res){
    Profile.findByIdAndRemove(req.params.id).then(function(){
      res.json({success: true});
    });
  },
  getStamps:function(req,res){
    Profile.findById(req.params.id).populate("stamps").then(function(profile){
      res.json(profile.stamps);
    });
  },
  addStamp:function(req,res){
    Profile.findById(req.params.id,function(err,docs){
      var stamp = new Stamp(req.body);
      docs.stamps.push(stamp);
      docs.save(function(err){
        if(!err){
          res.json(stamp);
        }
      });
    });
  }
}

module.exports = profilesController;
