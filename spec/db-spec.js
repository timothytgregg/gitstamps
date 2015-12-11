var mongoose = require("mongoose");
var Profile = require("../models/profile");
var Stamp = require("../models/stamp");
mongoose.connection.close()
mongoose.connect('mongodb://localhost/test-gitstamps')

describe("a working database", function(){
  var testStamp = new Stamp({})
  var testProfile = new Profile({})

  beforeEach(function(done){
    Profile.remove({}).then(function(){
      Stamp.remove({}).then(function(){
        Profile.findOne({}).then(function(err, docs){
          testProfile = docs;
          Stamp.findOne({}).then(function(err, docs){
            testStamp = docs;
            done();
          })
        })
      })
    })
  })
  it("should be connected to a mongodb db called test-gitstamps", function(){
    expect(mongoose.connection.db.s.databaseName).toEqual("test-gitstamps");
  })
  it("can't find a stamp after removing collection", function(){
    expect(testStamp).toBeUndefined();

  })
  it("can't find a profile after removing collection", function(){
    expect(testProfile).toBeUndefined();
  })
});
