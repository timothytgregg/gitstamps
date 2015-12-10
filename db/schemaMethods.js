// this function sets up a GH object on which subseqent calls will be made.
// login is handled via the oath token of the currently logged in user.  this limits
// each user to 5000 github requests per hour.
var setUp = function(token) {
  var GitHubApi = require("github");
  var github = new GitHubApi({
    version: "3.0.0",
    protocol: "https",
    host: "api.github.com",
    pathPrefix: "",
    timeout: 5000, // responses will time out after this many milliseconds
    headers: {
    }
  });
  github.authenticate({
    type: "token",
    token: token // oauth token from current user
  });
  console.log("Logged in to Github!")
  return github;
}

// this method checks to see if a user exists for the requested username
var checkGHUser = function (github, user) {
  return new Promise(function(resolve, reject){
    github.repos.getFromUser({
      user:user,
      per_page:1
    }, function(err,result){
      if (err){
        console.log("User name not valid.")
      }else{
        resolve(result)
      }
    })
  })
}
// this method takes a user name and a GH object (generated from setUp)
// and retrieves all of a user's repos. it returns a promise onto which we
// chain the next function below
var getRepoNamesChain = function (user, github) {
  return new Promise(function(resolve, reject){
    console.log("Getting repo names...")
    var names = []; // array to store names of repos as strings

    github.repos.getFromUser({
      user: user, // user we want to search for
      sort: "updated", // order by most recently updated
      per_page: 100, // number of repos we want to see (100 max)
    }, function(err, res) {
      if (err){
        console.log("CLOG ERROR @repos: "+err)
        return err;
      }
      for (var h=0; h < res.length; h++){
        //if (res[h].fork == false) {
          names.push(res[h].name); // construct the array of repo names
        //}
      }
      console.log("Found "+names.length+" repos")
      // checkAuthors(user, github, stamp, profile, names, resp);
      resolve(names);
    })
  })
}


// this method makes sure that the user being searched for is a contributor
// on the repo in question before we search for it.  essentially it takes a user
// name and an array of repos and edits the array so as to remove any repo
// to which the user has not contributed.  it returns a promise onto which the next
// function is chained (below)
var checkAuthors = function (user, github, names) {
  return new Promise(function(resolve, reject){
    console.log("Checking authorship of user per repo...")
    var counter = 0;
    var originalNumRepos = names.length;
    for (var i=0; i<names.length; i++) {
      github.repos.getContributors({
        user: user, // user we want to search for
        per_page: 100, // number of repos we want to see (100 max)
        repo: names[i]
      }, function(err, res) {
        if (err){
          console.log("Error checking contributors: "+err);
        }
        if (res) {
          var use_this_repo = false;
          for (var j=0; j<res.length; j++){
            if (res[j].login) {
              if (res[j].login == user){
                use_this_repo = true;
              }
            }
          }
          if (!use_this_repo){
            names.splice(this.j, 1);
          }
        }
        if (counter++ == originalNumRepos-1){
          console.log("Disregarding "+(originalNumRepos-(names.length))+" repos because "+user+" is not a contributor")
          // getCommitMessages(user, github, stamp, profile, names, resp);
          resolve(names);
        }
      }.bind({i:i}))
    }
  })
}

// this method takes an array of strings (GH repos) and finds all commit messages on those
//repos, checking to make the author we're searching for actually authored those commitMessages
// it returns a promise onto which the next function is called.
var getCommitMessages = function (user, github, names){
  return new Promise(function(resolve, reject){
    console.log("Getting Commit Messages...")
    var callsDone = 0; // count calls done so we know when all calls have returned from github
    var nameMsgMap = {}; // object that will store the repo names as keys and the commit messages as values
    for (var i = 0; i < names.length; i++) { // for each repo name, make a call to github for all commit messages on that repo
      github.repos.getCommits({
        user: user,
        repo: names[i], // the current repo being searched
        per_page: 100
      }, function(error, response){

        if (response) {
          console.log("Messages from @"+names[this.i]+" retrieved!"+"("+(callsDone+1)+")") // sucess message
          var msgs = []; // array to hold every message on a given repo
          // make sure the user in question is the author of the commit
          for (var a = 0; a < response.length; a++){
            if (response[a]['committer']) {
              if (response[a]['committer']['login'] == user) {
                msgs.push(response[a]['commit']['message']) // add message onto the array
              }
            }
          }
          nameMsgMap[names[this.i].replace(/\./g,' ')] = msgs; // construct the object so the key is the repo and the value is the array of commit messages
        }
        if (error) {
          console.log("ERROR in GH CALL @"+names[this.i]+": "+error)
        }
        if (++callsDone == names.length){ // check to see if we've done the total number of calls.  if we have, the number of calls will equal the number of repos
          console.log("Got Commit Messages!"); // success message
          // stamp.data.commitMessages = nameMsgMap // set the commitMessages column on the stamp to be the object we constructed above
          // getLangs(user, github, stamp, profile, names, resp) // now we call the getLangs method, to get all langugages on each repo
          var responseObject = {
                            names: names,
                            nameMsgMap: nameMsgMap
                            }
          resolve(responseObject);
        }
      }.bind({i:i})) // bind i so we can use it to figure out which repo we're currently searching.  this is needed in order to match repos to commit messages

    }
  })
}
// this function takes a user and a list of repos.  it fins the language breakdown per repo and returns that
// information through a promise.  after this promise is fufilled (back in the profilescontroller) we save all this
// data to the stamp and render it
var getLangs = function(user, github, names){
  return new Promise(function(resolve, reject){
    console.log("Getting Languages...")
    var calls = 0;
    var nameLangMap = {};
    for (var i = 0; i < names.length; i++) {
      github.repos.getLanguages({
        user: user, // github user name
        repo: names[i], // current repo
        per_page: 100
      }, function(error, response){
        if (error) {
          console.log("ERROR in GH CALL @"+names[this.i]+": "+error)
        }
        if (response) {
          console.log("Languages from @"+names[this.i]+" retrieved!"+"("+(calls+1)+")") // success message
          nameLangMap[names[this.i].replace(/\./g,' ')] = response; // constructing the object
        }
        if (++calls == names.length){ // check to see if all calls have returned
          console.log("Got Languages!") // success message
          resolve(nameLangMap)
        }
      }.bind({i:i})) // bind i from the for loop so we have access to it each callback
    }
  })
}
// this method should only be called after getLangs.  it parses through
// the languages object in a stamp and finds the total number of languages
// and then stores that value in langTotals column in our stamp object
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
    return langStats;
}
// this method uses the total languages column in the database
// to calculate the percentage of each language the user has
// written in
var langAverages = function(langStats){
  var langAverages = {};
  var sum  = 0
    for (var key1 in langStats){
      sum += langStats[key1]
    }
    for (var lang in langStats) {
      langAverages[lang]=langStats[lang]/sum
    }
  return langAverages;
}
// this method should only be called after getCommitMessages.  it parses through
// the messages object in a stamp and then finds the average message length, which
// it stores in the averageMessageLength column
var msgAverages = function (messages){
  var averageLength=0;
  var numMessages=0;
  var totalLength=0;
  for (var key in messages){
    for (var i = 0; i < messages[key].length; i++){
      totalLength += messages[key][i].length
      numMessages++;
    }
  }
  averageLength = totalLength/numMessages;
  return averageLength;
}
// export functions for use in profilesController
module.exports = {
  setUp: setUp,
  getRepoNamesChain: getRepoNamesChain,
  getCommitMessages: getCommitMessages,
  checkGHUser: checkGHUser,
  checkAuthors: checkAuthors,
  getCommitMessages: getCommitMessages,
  getLangs: getLangs,
  langAverages: langAverages,
  parseLangs: parseLangs,
  msgAverages: msgAverages
}
