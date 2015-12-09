var express = require("express");
var router = express.Router();
var Profile = require("../models/profile")
var Stamp = require("../models/stamp")
var User = require("../models/user")

function error(response, message){
  response.status(500);
  response.json({error: message})
}

var profilesController = {
  getProfiles: function(req,res){
    if (req.params.format){
      Profile.find({}).populate("stamps").then(function(profiles){
        res.json(profiles);//response renders json of profiles
      });
    }else{
      Profile.find({}).populate("stamps").then(function(profiles){
        res.render("index")
      })
    }
  },
  getProfile: function(req,res){
    Profile.findById(req.params.id).populate("stamps").then(function(profile){
      res.json(profile);
    });
  },
  addProfile:function(req,res){
    new Profile(req.body).save().then(function(profile){
      User.findById(req.user._id, function(err,docs){
        docs.follows.push(profile._id);
        docs.save(function(err){
          if(!err){
            res.json(profile)
          }
        });
      });
    });
  },
  updateProfile:function(req,res){
    Profile.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).then(function(profile){
      res.json(profile);
    });
  },
  deleteProfile:function(req,res){
    Profile.findByIdAndRemove(req.params.id).then(function(profile){
      console.log("removing "+profile.username+" from the db...")
      res.json({success: true});
    });
  },
  getStamps:function(req,res){
    Profile.findById(req.params.id).populate("stamps").then(function(profile){
      res.json(profile.stamps);
    });
  },
  addStamp:function(req,res){
    var token = req.user.github.token;
    Profile.findById(req.params.id,function(err,docs){
      var stamp = new Stamp(req.body);
      var git = stamp.setUp(token);
      stamp.getMsgs(docs.username, git);
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
