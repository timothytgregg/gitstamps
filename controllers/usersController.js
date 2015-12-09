var express = require("express");
var Profile = require("../models/profile")
var Stamp = require("../models/stamp")
var User = require("../models/user")

var usersController = {
  login:function(req,res){
    res.render('login')
  },
  logout:function(req,res){
    req.session.destroy();
    req.logout();
    res.redirect('/login');
  },
  unfollowProfile:function(req,res){
    User.findById(req.user._id,function(err,docs){
      var idx = docs.follows.indexOf(req.params.id);
      docs.follows.splice(idx,1);
      docs.save(function(err){
        if(!err){
          res.json({success: true})
        }
      })
    })
  }
}
module.exports = usersController;
