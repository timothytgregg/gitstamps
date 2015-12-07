var express = require("express");
var Profile = require("../models/profile")
var Stamp = require("../models/stamp")

var usersController = {
  login:function(req,res){
    res.render('login')
  },
  logout:function(req,res){
    req.session.destroy();
    req.logout();
    res.redirect('/login');
  }
}
module.exports = usersController;
