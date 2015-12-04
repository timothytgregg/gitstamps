// requiring mongoose dependency
var mongoose = require('mongoose');

// instantiate a name space for our Schema constructor defined by mongoose.
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

// defining schema for reminders
var GitstampSchema = new Schema({
  data: Float
})

// defining schema for authors.
var ProfileSchema = new Schema({
  name: String,
  gitstamps: [GitstampSchema]
})

// setting models in mongoose utilizing schemas defined above
var ProfileModel = mongoose.model("Profile", ProfileSchema)
var GitstampModel = mongoose.model("Gitstamp", GitstampSchema)
