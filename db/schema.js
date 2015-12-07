// requiring mongoose dependency
var mongoose = require('mongoose');

// instantiate a name space for our Schema constructor defined by mongoose.
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

// defining schema for reminders
var GitstampSchema = new Schema({
  data: String
})

// defining schema for authors.
var ProfileSchema = new Schema({
  username: String,
  gitstamps: [GitstampSchema]
})

ProfileSchema.methods.sayHi = function(){
  console.log("hi");
}

// setting models in mongoose utilizing schemas defined above
var ProfileModel = mongoose.model("Profile", ProfileSchema)
var GitstampModel = mongoose.model("Gitstamp", GitstampSchema)
