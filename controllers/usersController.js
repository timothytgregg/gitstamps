var express = require("express");
var Profile = require("../models/profile")
var Stamp = require("../models/stamp")

var usersController = {
  login:function(req,res){
    res.render('login.hbs')
  }
}
module.exports = usersController;
