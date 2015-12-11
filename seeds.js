// requires mongoose dependencies
var mongoose = require('mongoose')
// connects us to the reminders database in mongo
var conn = mongoose.connect(process.env.MONGOLAB_URI ||'mongodb://localhost/chase-express')
// require our model definitions we defined earlier
var ProfileModel = require("./models/profile")
var StampModel = require("./models/stamp")
var UserModel = require("./models/user")
// removes any existing profiles and stamps from our database
ProfileModel.remove({}, function(err){
})
StampModel.remove({}, function(err){
})
UserModel.remove({}, function(err){
})

console.log("db is empty")
