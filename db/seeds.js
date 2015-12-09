// requires mongoose dependencies
var mongoose = require('mongoose')
// connects us to the reminders database in mongo
var conn = mongoose.connect(process.env.MONGOLAB_URI ||'mongodb://localhost/chase-express')
// require our model definitions we defined earlier
var ProfileModel = require("../models/profile")
var StampModel = require("../models/stamp")
var UserModel = require("../models/user")
// removes any existing profiles and stamps from our database
ProfileModel.remove({}, function(err){
})
StampModel.remove({}, function(err){
})
UserModel.remove({}, function(err){
})

console.log("db is empty")

// instantiates 3 authors and 6 reminders in memory(but not saved yet) and
// shoves them into arrays
// var bob = new ProfileModel({username: "bob"})
// var charlie = new ProfileModel({username: "charlie"})
// var tom = new ProfileModel({username: "tom"})

// var stamp1 = new StampModel({data:{language: "Stamp1!!"}})
// var stamp2 = new StampModel({data:{language: "Stamp2!!"}})
// var stamp3 = new StampModel({data:{language: "Stamp3!!"}})
// var stamp4 = new StampModel({data:{language: "Stamp4!!"}})
// var stamp5 = new StampModel({data:{language: "Stamp5!!"}})
// var stamp6 = new StampModel({data:{language: "Stamp6!!"}})

// var profiles = [bob, charlie, tom]
// var stamps = [stamp1, stamp2, stamp3, stamp4, stamp5, stamp6]

// iterate through the profiles to save them to the database after 2 stamps
// have been added as subdocuments to the profile
// for(var i = 0; i < profiles.length; i++){
//   // profiles[i].stamps.push(stamps[i], stamps[i+3])
//   profiles[i].save(function(err){
//     if (err){
//       console.log(err)
//     }else {
//       console.log("profile was saved")
//     }
//   })
// }
