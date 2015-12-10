// most of these tests are meaningless but they're better than nothing, right?
var Profile = require("../models/profile")
var Stamp = require("../models/stamp")

describe ("the profile model", function(){
  var testProfile = new Profile({
    createdAt: Date(),
    username: Math.random().toString(36).substring(7),
    stamps: []
  })
  it("should have an id", function(){
    expect(testProfile.id).toEqual(jasmine.any(String));
  });
  it("should have a username", function(){
    expect(testProfile.username).toEqual(jasmine.any(String));
  });
  it("should have a created-at date", function(){
    expect(testProfile.createdAt).toEqual(jasmine.any(Date));
  });
  it("should have an empty array of stamps", function(){
    expect(testProfile.stamps.length).toBe(0);
  });
})
