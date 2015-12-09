// this function sets up a GH object on which subseqent calls will be made
// login right now is handled via an access_token in env.js in the root
// directory.  we'll try to make the login work with an oauth token later
var setUp = function(token) {
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
      type: "token",
      token: token
  });
  console.log("Logged in to Github!")
  return github;
}
// this method takes a user name and a GH object (generated from setUp)
// and retrieves all of a user's repos.  it then loops through each repo and
// constructs an object where the keys are repo names and the values are language objects.  this object is then stored in the db, not returned.
var getCommitMessagesC = function (user, github, stamp, profile, resp) {
  // var self = this;
  github.repos.getFromUser({
    user: user,
    sort: "updated",
    per_page: 100,
  }, function(err, res) {
    // var that = self;
    console.log("Getting Commit Messages...")
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
        // if (error){
        //   callsDone++;
        //   console.log("CLOG ERROR @msgs from #"+callsDone+" @"+names[this.i]+": "+error);
        //   return error;
        // }
        if (response) {
          console.log("Messages from #"+callsDone+" repo retrieved!")
          var msgs = [];
          for (var a = 0; a < response.length; a++){
            msgs.push(response[a]['commit']['message'])
          }
            nameMsgMap[names[this.i].replace(/\./g,' ')] = msgs;
        }
        if (++callsDone == names.length){
          console.log("Got Commit Messages!");
          stamp.data.commitMessages = nameMsgMap
          getLangsC(user, github, stamp, profile, names, resp)
        }
      }.bind({i:i}))
    }
  })
}

var getLangsC = function(user, github, stamp, profile, names, resp){
  console.log("Getting Languages...")
  var calls = 0;
  var nameLangMap = {};
  for (var i = 0; i < names.length; i++) {
    github.repos.getLanguages({
      user: user,
      repo: names[i],
      per_page: 100
    }, function(error, response){
      // if (error){
      //   calls++
      //   console.log("CLOG ERROR @langs from @"+names[this.i]+": "+error)
      //   return error;
      // }
      console.log("Languages from #"+calls+" repo retrieved!")
      nameLangMap[names[this.i].replace(/\./g,' ')] = response;
      if (++calls == names.length){
        console.log("Got Languages!")
        stamp.data.languages = nameLangMap;
        stamp.data.langTotals = parseLangs(nameLangMap);
        stamp.data.langAverages = langAverages(stamp.data.langTotals)
        profile.stamps.push(stamp);
        resp.json(stamp)
        profile.save(function(err, profile){
          if (err){
            console.log("Error with DB call: "+err)
          } else {
            console.log("Saved stamp to DB under profile.")
            return;
          }
        })
      }
    }.bind({i:i}))
  }
}
// this method should only be called after getLangs.  it parses through
// the languages object in a stamp and finds the total number of languages
// and then stores that value in another column.
var parseLangs = function (allLangs) {
  var langStats = {};
    for (var key1 in allLangs) {
      for (var key2 in allLangs[key1]) {
        if (key2 != 'meta') {
          if (langStats.hasOwnProperty(key2)) {
            langStats[key2]+=allLangs[key1][key2];
          }
          else {
            langStats[key2]=allLangs[key1][key2];
          }
        }
      }
    }
    console.log("reached end "+langStats)
    return langStats;
}

var langAverages = function(langStats){
  console.log(langStats)
  var langAverages = {};
  var sum  = 0
    for (var key1 in langStats){
      sum += langStats[key1]
      console.log(sum)
    }
    for (var lang in langStats) {
      langAverages[lang]=langStats[lang]/sum
    }
  console.log(langAverages)
  return langAverages;
}

var msgAverages = function (messages){

}
// this method should only be called after getCommitMessages.  it parses through
// the messages object in a stamp and then finds the average message length, which
// it stores in a column
var parseMsgs = function (id) {

//SAVE IN DB HERE
}

module.exports = {
  setUp: setUp,
  getCommitMessagesC: getCommitMessagesC,
}
