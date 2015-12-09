var mongoose = require("mongoose")
var conn = mongoose.connect(process.env.MONGOLAB_URI ||'mongodb://localhost/chase-express')
var functs = require("./db/schemaMethods.js")
var Stamp = require("./models/stamp.js")
// var E = require("./env.js")

var testModel = new Stamp({})
var git = testModel.setUp(E.ghKey)
testModel.getCommitMessagesR('solowt', git);


var getLangs = function(user, github) {
  var self = this;
  github.repos.getFromUser({
    user: user,
    sort: "updated",
    per_page: 100
  }, function(err, res) {
    var that = self;
    if (err){
      console.log("CLOG @ repos ERROR: "+err)
      return err;
    }
    var names = [];
    var nameLangMap = {};
    for (var h=0; h < res.length; h++){
      names.push(res[h].name);
    }
    var callsDone = 0;
    for (var i = 0; i < names.length; i++) {
      callsDone++;
      github.repos.getLanguages({
        user: user,
        repo: names[i],
        per_page: 100

      }, function(error, response){
        var thar = that;
        if (error){
          console.log("CLOG ERROR @langs from @"+names[this.i]+": "+error)
          return error;
        }
        nameLangMap[names[this.i].replace(/\./g,' ')] = response;
        if (this.callsDone == names.length){
          thar.data.languages = nameLangMap;
          thar.save(function(err){
            if (err){
              console.log(err);
              return;
            } else{
              console.log("Saved successfully!");
              return;
            }
          })
        }
      }.bind({
              i:i,
              callsDone:callsDone
            }))
    }
  })
}

// this method takes a user name and a GH object (generated from setUp)
// and retrieves all of a user's repos.  it then loops through each repo and
// constructs an object where the keys are repo names and the values are objects
// containing both language information and meta data.  stores this object in
// the db, it does not return it.
var getCommitMessages = function (user, github) {
  var self = this;
  github.repos.getFromUser({
    user: user,
    sort: "updated",
    per_page: 100,
  }, function(err, res) {
    var that = self;
    if (err){
      console.log("CLOG ERROR @repos: "+err)
      return err;
    }
    var names = [];
    var nameMsgMap = {};
    for (var h=0; h < res.length; h++){
      names.push(res[h].name);
    }
    // try to get access to callsDone with bind
    var callsDone = 0;
    for (var i = 0; i < names.length; i++) {
      github.repos.getCommits({
        user: user,
        repo: names[i],
        per_page: 100
      }, function(error, response){
        var thar = that;
        if (error){
          callsDone++;
          console.log("CLOG ERROR @msgs from @"+names[this.i]+": "+error)
          return error;
        }
        var msgs = [];
        for (var a = 0; a < response.length; a++){
          msgs.push(response[a]['commit']['message'])
        }
          nameMsgMap[names[this.i].replace(/\./g,' ')] = msgs;
        if (++callsDone == names.length){
          console.log(nameMsgMap);
          thar.data.commitMessages = nameMsgMap;
          thar.save(function(err){
            if (err){
              console.log(err);
              return;
            } else{
              console.log("Saved successfully!");
              return;
            }
          })
        }
      }.bind({
              i:i
            }))
    }
  })
}

var getCommitMessagesR = function (user, github, stamp) {
  github.repos.getFromUser({
    user: user,
    sort: "updated",
    per_page: 100,
  }, function(err, res) {
    // var that = self;
    if (err){
      console.log("CLOG ERROR @repos: "+err)
      return err;
    }
    var names = [];
    var nameMsgMap = {};
    for (var h=0; h < res.length; h++){
      names.push(res[h].name);
    }
    return getMsgR(0, names, github, user, nameMsgMap, stamp)
  })
}

var getMsgR = function (iter, names, github, user, nameMsgMap, stamp) {
  console.log(iter);
  if (iter < names.length) {
    github.repos.getCommits({
      user: user,
      repo: names[iter],
      per_page: 100
    }, function(err, res) {
      if (err){
        console.log("error "+err)
        getMsgR(iter, names, github, user, nameMsgMap, stamp)
      } else {
        var msgs = [];
        for (var a = 0; a < res.length; a++){
          msgs.push(res[a]['commit']['message'])
        }
        nameMsgMap[names[iter].replace(/\./g,' ')] = msgs;
        getMsgR(iter+1, names, github, user, nameMsgMap, stamp)
      }
    })
  } else {
    stamp.data.commitMessages = nameMsgMap;
  }
}

var getCommitMessagesA = function (user, github, stamp, profile) {
  // var self = this;
  github.repos.getFromUser({
    user: user,
    sort: "updated",
    per_page: 100,
  }, function(err, res) {
    // var that = self;
    if (err){
      console.log("CLOG ERROR @repos: "+err)
      return err;
    }
    var names = [];
    var nameMsgMap = {};
    for (var h=0; h < res.length; h++){
      names.push(res[h].name);
    }
    // try to get access to callsDone with bind
    var callsDone = 0;
    for (var i = 0; i < names.length; i++) {
      github.repos.getCommits({
        user: user,
        repo: names[i],
        per_page: 100
      }, function(error, response){
        // var thar = that;
        if (error){
          callsDone++;
          console.log("CLOG ERROR @msgs from @"+names[this.i]+": "+error)
          return error;
        }
        var msgs = [];
        for (var a = 0; a < response.length; a++){
          msgs.push(response[a]['commit']['message'])
        }
          nameMsgMap[names[this.i].replace(/\./g,' ')] = msgs;
        if (++callsDone == names.length){
          console.log(nameMsgMap);
          stamp.data.commitMessages = nameMsgMap
          profile.stamps.push(stamp)
          profile.save().then(function(err){
            if (err){

            }
          })

        }
      }.bind({i:i}))
    }
  })
}

var getLangs = function(user, github) {
  var self = this;
  github.repos.getFromUser({
    user: user,
    sort: "updated",
    per_page: 100
  }, function(err, res) {
    var that = self;
    if (err){
      console.log("CLOG @ repos ERROR: "+err)
      return err;
    }
    var names = [];
    var nameLangMap = {};
    for (var h=0; h < res.length; h++){
      names.push(res[h].name);
    }
    var callsDone = 0;
    for (var i = 0; i < names.length; i++) {
      callsDone++;
      github.repos.getLanguages({
        user: user,
        repo: names[i],
        per_page: 100

      }, function(error, response){
        var thar = that;
        if (error){
          console.log("CLOG ERROR @langs from @"+names[this.i]+": "+error)
          return error;
        }
        nameLangMap[names[this.i].replace(/\./g,' ')] = response;
        if (this.callsDone == names.length){
          thar.data.languages = nameLangMap;
          thar.save(function(err){
            if (err){
              console.log(err);
              return;
            } else{
              console.log("Saved successfully!");
              return;
            }
          })
        }
      }.bind({
              i:i,
              callsDone:callsDone
            }))
    }
  })
}
