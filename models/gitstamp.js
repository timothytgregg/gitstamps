require("../db/schema")
var mongoose = require('mongoose')

var GitstampModel = mongoose.model("Gitstamp")
module.exports = GitstampModel
