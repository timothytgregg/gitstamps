var E = require("../env.js")
var GitHubApi = require("github");
var Stamp = require("../models/stamp.js")
var Profile = require("../models/stamp.js")


// this function sets up a GH object on which subseqent calls will be made
// login right now is handled via an access_token in env.js in the root
// directory.  we'll try to make the login work with an oauth token later
var setUp = function() {
  var github = new GitHubApi({
      version: "3.0.0",
      protocol: "https",
      host: "api.github.com", // should be api.github.com for GitHub
      pathPrefix: "", // for some GHEs; none for GitHub
      timeout: 5000,
      headers: {

      }
  });
  github.authenticate({
      // type: "basic",
      // username: E.email,
      // password: E.pw
      type: "token",
      token: E.a_c
  });
  return github;
}

// this method takes a user name and a GH object (generated from setUp)
// and retrieves all of a user's repos.  it then loops through each repo and
// constructs an object where the keys are repo names and the values are objects
// containing both language information and meta data.  stores this object in
// the db, it does not return it.
var getCommitMessages = function (user, github, id) {
  github.repos.getFromUser({
    user: user,
    sort: "updated",
    per_page: 100,
  }, function(err, res) {
    if (err){
      console.log("CLOG ERROR: "+err)
      return err;
    }
    var names = [];
    var nameMsgMap = {};
    for (var h=0; h < res.length; h++){
      names.push(res[h].name);
    }
    var callsDone = 0;
    for (var i = 0; i < names.length; i++) {
      github.repos.getCommits({
        user: user,
        repo: names[i],
        per_page: 100
      }, function(error, response){
        if (error){
          console.log("CLOG ERROR: "+error)
          return error;
        }
        var msgs = [];
        for (var a = 0; a < response.length; a++){
          msgs.push(response[a]['commit']['message'])
        }
          nameMsgMap[names[this.i]] = msgs;
        if (++callsDone == names.length-1){
          //SAVE IN DB HERE

          // Stamp.findOneAndUpdate({id:id},{data:{languages: nameMsgMap}}).then(function(err, query){
          //   if (err){
          //     console.log("ERROR: "err);
          //   } else{
          //     console.log("Update Successful!")
          //   }
          // })
        }
      }.bind({i:i}))
    }
  })
}
// this method takes a user name and a GH object (generated from setUp)
// and retrieves all of a user's repos.  it then loops through each repo and
// constructs an object where the keys are repo names and the values are arrays
// of commit messages.  this object is then stored in the db, not returned.
var getLangs = function(user, github, id) {
  github.repos.getFromUser({
    user: user,
    sort: "updated",
    per_page: 100
  }, function(err, res) {
    if (err){
      console.log("CLOG ERROR: "+err)
      return err;
    }
    var names = [];
    var nameLangMap = {};
    for (var h=0; h < res.length; h++){
      names.push(res[h].name);
    }
    var callsDone = 0;
    for (var i = 0; i < names.length; i++) {
      github.repos.getLanguages({
        user: user,
        repo: names[i],
        per_page: 100

      }, function(error, response){
        if (error){
          console.log("CLOG ERROR: "+error)
          return error;
        }
        nameLangMap[names[this.i]] = response;
        if (++callsDone == names.length-1){
          //SAVE IN DB HERE

        }
      }.bind({i:i}))
    }
  })
}

// this method should only be called after getLangs.  it parses through
// the languages object in a stamp and finds the total number of languages
// and then stores that value in another column.
var parseLangs = function (id) {
  var stats = {};
    Blank.findOne().lean().exec(function(err, data) {
    var doc = data.blank[0];
    for (var key1 in doc) {
      for (var key2 in doc[key1]) {
        if (key2 != 'meta') {
          if (stats.hasOwnProperty(key2)) {
            stats[key2]+=doc[key1][key2];
          }
          else {
            stats[key2]=doc[key1][key2];
          }
        }
      }
    }
    //SAVE IN DB HERE
  });
}
// this method should only be called after getCommitMessages.  it parses through
// the messages object in a stamp and then finds the average message length, which
// it stores in a column
var parseMsgs = function (id) {

//SAVE IN DB HERE
}

module.exports = {
  setUp: setUp,
  getCommitMessages: getCommitMessages
}
