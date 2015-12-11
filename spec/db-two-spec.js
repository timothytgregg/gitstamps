var mongoose = require("mongoose");
var Profile = require("../models/profile");
var Stamp = require("../models/stamp");


describe("a working db also", function(){
  var testStamp = undefined;
  var testStamp = undefined;

  beforeEach(function(done){
    Profile.remove({}).then(function(){
      Stamp.remove({}).then(function(){
        testStamp = new Stamp({createdAt:Date()});
        testProfile = new Profile({username: "tester"});
        testStamp.save().then(function(){
          testProfile.save().then(function(){
            Profile.findOne({}).then(function(docs, err){
              testProfile = docs;
              Stamp.findOne({}).then(function(docs, err){
                testStamp = docs;
                done();
              })
            })
          })
        })
      })
    })
  })
  it("can find a stamp after adding and saving one", function(){
    expect(testStamp).toBeDefined();
  })
  it("can find a profile after adding and saving one", function(){
    expect(testProfile).toBeDefined();
  })
});
