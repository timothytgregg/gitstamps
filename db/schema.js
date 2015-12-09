// requiring mongoose dependency
// var E = require("../env.js")
var mongoose = require('mongoose')
// var SchemaMethods = require("./schemaMethods")

// instantiate a name space for our Schema constructor defined by mongoose.
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

// defining schema for stamps
var StampSchema = new Schema({
  createdAt: Date,
  data: {
    languages: Object,
    commitMessages: Object,
    averageMessageLength: Number,
    langTotals: Object,
    langAverages: Object
  }
});
// see schemaMethods for a description of this method
// StampSchema.methods.setUp = SchemaMethods.setUp;
// // see schemaMethods for a description of this method
// StampSchema.methods.getMsgs = SchemaMethods.getCommitMessages;
// // see schemaMethods for a description of this method
// StampSchema.methods.getLangs = SchemaMethods.getLangs;
//

// defining schema for profiles.
var ProfileSchema = new Schema({
  createdAt: Date,
  username: String,
  stamps: [StampSchema]
})

var UserSchema = new Schema({
  local : {
    email: String,
    password: String,
  },
  github : {
    id: String,
    token: String,
    username: String,
    displayName: String
  },
  follows:[]
});

// setting models in mongoose utilizing schemas defined above, we'll be using
// these frequently throughout our app
mongoose.model("Profile", ProfileSchema)
mongoose.model("Stamp", StampSchema)
mongoose.model("User", UserSchema)
