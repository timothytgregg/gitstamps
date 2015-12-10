// most of these tests are meaningless but they're better than nothing, right?
Stamp = require("../models/stamp")
describe("the stamp model", function(){
  var testStamp = new Stamp({
    createdAt: Date(),
    data: {
      languages: {"test":5000},
      commitMessages: {"test":5000},
      averageMessageLength: Math.random(),
      langTotals: {"test":5000},
      langAverages: {"test":5000}
    }
  });
  it("should have an id", function(){
    expect(testStamp.id).toEqual(jasmine.any(String));
  });
  it("should have a time stamp", function(){
    expect(testStamp.createdAt).toEqual(jasmine.any(Date));
  });
  it("should have data", function(){
    expect(testStamp.data.languages.test).toEqual(5000);
  });
  it("should have data", function(){
    expect(testStamp.data.commitMessages.test).toEqual(5000);
  });
  it("should have data", function(){
    expect(testStamp.data.averageMessageLength).toEqual(jasmine.any(Number));
  });
  it("should have data", function(){
    expect(testStamp.data.langTotals.test).toEqual(5000);
  });
  it("should have data", function(){
    expect(testStamp.data.langAverages.test).toEqual(5000);
  });
});
