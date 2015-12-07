var express = require('express')// express dependency for our application
var mongoose = require('mongoose')// loads mongoose dependency
var bodyParser = require('body-parser')// loads dependency for middleware for paramters
var methodOverride = require('method-override')// loads dependency that allows put/delete where not supported in html
var hbs = require('hbs');

mongoose.connect('mongodb://localhost/chase-express')// connect mongoose interfaces to reminders mongo db

var passport = require('passport');
var util = require('util');
var router = require('./config/routes');

require('./config/passport')(passport);

var app = express()// invokes express dependency and sets namespace to app
app.use(bodyParser.json());// allows for parameters in JSON and html
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'))// allows for put/delete request in html form
app.set('view engine', 'hbs');
app.set("views",__dirname +"/views");
app.use(express.static(__dirname + '/public'))// connects assets like stylesheets

app.use(passport.initialize())
app.use(passport.session())

app.use(router)

// app server located on port 4000
app.listen(4000, function(){
  console.log("app listening on port 4000")
})
