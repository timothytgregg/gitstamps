var E = require("./env.js")

//var blank = new Blank({blank:languages});
//           console.log(blank);
//           blank.save();
//AVG

var parseLangs = function () {
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
    console.log(stats);
  });
}

var parseMsgs = function () {

}
var setUp = function() {
  var GitHubApi = require("github");
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

var getLangs = function(user, github) {
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
          console.log("DONE");
          console.log(nameLangMap);
          // return nameLangMap;
        }
      }.bind({i:i}))
    }
  })
}


// getLangs("solowt", setUp());
var getCommitMessages = function (user, github) {
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
          console.log("DONE");
          console.log(nameMsgMap);
        }
      }.bind({i:i}))
    }
  })
}
getCommitMessages('solowt', setUp())
// getCommitMsg();
module.exports = {
  setUp: setUp,
  getLangs: getLangs,
  getCommitMessages: getCommitMessages
}
