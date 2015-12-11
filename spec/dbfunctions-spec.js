var Functions = require("../db/schemaMethods");
var mongoose = require("mongoose");
var Profile = require("../models/profile");
var Stamp = require("../models/stamp");
var env = require("../env.js")
jasmine.getEnv().defaultTimeoutInterval = 15000;

describe("a call to github ", function(){
  var git = Functions.setUp(env.ghKey);
  var testStamp;
  var testProfile;
  var testProfileA;
  var testStampA;
  beforeEach(function(done){
    Profile.remove({}).then(function(){
      Stamp.remove({}).then(function(){
          testStamp = new Stamp({})
          testProfile = new Profile({username: "solowt"})
          Functions.getRepoNamesChain(testProfile.username, git).then(function(repoNames) {
            Functions.checkAuthors(testProfile.username, git, repoNames).then(function(refinedNames) {
              Functions.getCommitMessages(testProfile.username, git, refinedNames).then(function(responseObject) {
                testStamp.data.commitMessages = responseObject.nameMsgMap;
                Functions.getLangs(testProfile.username, git, responseObject.names).then(function(nameLangMap) {
                  testStamp.data.languages = nameLangMap;
                  testStamp.data.langTotals = Functions.parseLangs(nameLangMap);
                  testStamp.data.langAverages = Functions.langAverages(testStamp.data.langTotals)
                  testStamp.data.averageMessageLength = Functions.msgAverages(testStamp.data.commitMessages)
                  testStamp.createdAt = Date();
                  testProfile.stamps.push(testStamp);
                  testProfile.save(function(err, docs) {
                  if (err) {
                    console.log("Failed to save stamp: " + err)
                  } else {
                    console.log("Saved stamp to DB under " + testProfile.username + "'s profile.")
                    Profile.findOne({username: 'solowt'}).then(function(docs, err){
                      testProfileA = docs;
                      done();
                    })
                  }
                })
              })
            })
          })
        })
      })
    })
  })
  it("should be able to find stored profiles", function(){
    expect(testProfileA).toBeDefined();
  })
  it("should be able to push a stamp onto the stamps array of a profile", function(){
    expect(testProfileA.stamps.length).toEqual(jasmine.any(Number));
  })
  it("should be able to populate all the data fields on a stamp", function(){
    expect(testProfileA.stamps[0].data.commitMessages).toEqual(jasmine.any(Object));
    expect(testProfileA.stamps[0].data.languages).toEqual(jasmine.any(Object));
    expect(testProfileA.stamps[0].data.langAverages).toEqual(jasmine.any(Object));
    expect(testProfileA.stamps[0].data.langTotals).toEqual(jasmine.any(Object));
    expect(testProfileA.stamps[0].data.averageMessageLength).toEqual(jasmine.any(Number));
  })
});
