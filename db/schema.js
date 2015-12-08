var schemaMethods = require("./schemaMethods.js")
// requiring mongoose dependency
var mongoose = require('mongoose')

// instantiate a name space for our Schema constructor defined by mongoose.
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

// defining schema for stamps
var StampSchema = new Schema({
  data: {
    languages: Array,
    commitMessages: Array,
    avgMsg: Number,
    totalLangs: Array
  }
});

ProfileSchema.methods.test = function(){
  schemaMethods.getCommitMessages(this.username,schemaMethods.setUp(), this._id)
}

// defining schema for profiles.
var ProfileSchema = new Schema({
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
  }
});

// setting models in mongoose utilizing schemas defined above, we'll be using
// these frequently throughout our app
mongoose.model("Profile", ProfileSchema)
mongoose.model("Stamp", StampSchema)
mongoose.model("User", UserSchema)
