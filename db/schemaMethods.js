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
// this method takes a user name and a GH object (generated from setUp)
// and retrieves all of a user's repos.  it then loops through each repo and
// constructs an object where the keys are repo names and the values are arrays of commit messages.
// the function also takes a stamp, on which where this object is stored, as well as a profile
// onto which the stamp is pushed.  it then saved into the database.  the resp parameter
// is then used to respond with json to the front end.
var getCommitMessagesC = function (user, github, stamp, profile, resp) {
  github.repos.getFromUser({
    user: user, // user we want to search for
    sort: "updated", // order by most recently updated
    per_page: 100, // number of repos we want to see (100 max)
  }, function(err, res) {
    console.log("Getting Commit Messages...")
    if (err){
      console.log("CLOG ERROR @repos: "+err)
      return err;
    }
    var names = []; // array to store names of repos as strings
    var nameMsgMap = {}; // object that will store the repo names as keys and the commit messages as values
    for (var h=0; h < res.length; h++){
      names.push(res[h].name); // construct the array of repo names
    }
    var callsDone = 0; // count calls done so we know when all calls have returned from github
    for (var i = 0; i < names.length; i++) { // for each repo name, make a call to github for all commit messages on that repo
      github.repos.getCommits({
        user: user,
        repo: names[i], // the current repo being searched
        per_page: 100
      }, function(error, response){
        if (response) {
          console.log("Messages from @"+names[this.i]+" retrieved!"+"("+(callsDone+1)+")") // sucess message
          var msgs = []; // array to hold every message on a given repo
          for (var a = 0; a < response.length; a++){
            msgs.push(response[a]['commit']['message']) // add message onto the array
          }
          nameMsgMap[names[this.i].replace(/\./g,' ')] = msgs; // construct the object so the key is the repo and the value is the array of commit messages
        }
        if (error) {
          console.log("ERROR in GH CALL @"+names[this.i]+": "+error)
        }
        if (++callsDone == names.length){ // check to see if we've done the total number of calls.  if we have, the number of calls will equal the number of repos
          console.log("Got Commit Messages!"); // success message
          stamp.data.commitMessages = nameMsgMap // set the commitMessages column on the stamp to be the object we constructed above
          getLangsC(user, github, stamp, profile, names, resp) // now we call the getLangs method, to get all langugages on each repo
        }
      }.bind({i:i})) // bind i so we can use it to figure out which repo we're currently searching.  this is needed in order to match repos to commit messages
    }
  })
}
// this function is called from inside the above function.  it is never called on its own.  it takes
// all of its parameters from the above function and loops through the same list of repos for the
// same user.  instead of getting commit messages, it looks for language data for that repo and constructs
// an object which is saved in the languages column of our stamp model.  after this process is complete,
// resp is rendered as json on the screen.
var getLangsC = function(user, github, stamp, profile, names, resp){
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
        stamp.data.languages = nameLangMap; // add object to stamp
        stamp.data.langTotals = parseLangs(nameLangMap); // see this function below
        stamp.data.langAverages = langAverages(stamp.data.langTotals) // see this function below
        stamp.data.averageMessageLength = msgAverages(stamp.data.commitMessages) // see this function below
        profile.stamps.push(stamp); // push the stamp onto the owner profile's array of stamps
        resp.json(stamp) // repsond with json
        profile.save(function(err, profile){ // save the profile
          if (err){
            console.log("Error with DB call: "+err)
          } else {
            console.log("Saved stamp to DB under "+user+"'s profile.")
            return;
          }
        })
      }
    }.bind({i:i})) // bind i from the for loop so we have access to it each callback
  }
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
  getCommitMessagesC: getCommitMessagesC,
}
