require("../db/schema")
var mongoose = require('mongoose')

var ProfileModel = mongoose.model("Profile");

module.exports = ProfileModel
