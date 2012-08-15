
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);


// Start server
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

//mongo
var db_url = process.env.MONGOHQ_URL || 'mongodb://localhost/test'
mongoose.connect(db_url);

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
  
var UserSchema = new Schema({
    id        : String
  , score     : Number
});

mongoose.model('User', UserSchema); 
var User = mongoose.model('User');

//Twitter Oauth
passport.use(new TwitterStrategy({
    consumerKey: dfrfRrhx2uIYXvwPGH3sPg,
    consumerSecret: zKLEOknTpb5e0ZzlWXcdU19nJj2RkcvCLqO9wQVr70,
    callbackURL: "http://dctechdcrap.herokuapp.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    //create user here
    console.log(profile);
  }
));

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
// /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));



// redirect all others to the index (HTML5 history)
app.get('*', routes.index);
















