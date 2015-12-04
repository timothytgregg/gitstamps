var mongoose = require('mongoose')
var conn = mongoose.connect('mongodb://localhost/gitstamps')
var ProfileModel = require("../models/profile")
var GitstampModel = require("../models/gitstamp")

ProfileModel.remove({}, function(err){
  console.log(err)
})
GitstampModel.remove({}, function(err){
  console.log(err)
})

var bob = new ProfileModel({name: "bob"})
var susy = new ProfileModel({name: "susy"})
var tom = new ProfileModel({name: "tom"})

var gitstamp1 = new GitstampModel({data: Math.random()});
var gitstamp2 = new GitstampModel({data: Math.random()});
var gitstamp3 = new GitstampModel({data: Math.random()});
var gitstamp4 = new GitstampModel({data: Math.random()});
var gitstamp5 = new GitstampModel({data: Math.random()});
var gitstamp6 = new GitstampModel({data: Math.random()});

var profiles = [bob, susy, tom]
var gitstamps = [gitstamp1, gitstamp2, gitstamp3, gitstamp4, gitstamp5, gitstamp6]

for(var i = 0; i < profiles.length; i++){
  profiles[i].gitstamps.push(gitstamps[i],gitstamps[i+3])
  profiles[i].save(function(err){
    if (err){
      console.log(err)
    }else {
      console.log("profile was saved")
    }
  })
}
