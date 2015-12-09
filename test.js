var mongoose = require("mongoose")
mongoose.connect('mongodb://localhost/chase-express')
var functs = require("./db/schemaMethods.js")
var Stamp = require("./models/stamp.js")
var E = require("./env.js")

var testModel = new Stamp({})
var git = testModel.setUp(E.ghKey)
testModel.getMsgs('solowt', git);
