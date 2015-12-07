var express = require('express')// express dependency for our application
var mongoose = require('mongoose')// loads mongoose dependency
var bodyParser = require('body-parser')// loads dependency for middleware for paramters
var methodOverride = require('method-override')// loads dependency that allows put/delete where not supported in html
var hbs = require('hbs');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

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

app.use(session({ secret: 'WDI-GENERAL-ASSEMBLY-EXPRESS' }));
app.use(passport.initialize())
app.use(passport.session())

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(router)

// app server located on port 3000
app.listen(3000, function(){
  console.log("app listening on port 3000")
})
