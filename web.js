
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose'),
    mongooseAuth = require('mongoose-auth'),
    everyauth = require('everyauth'),
    Promise = everyauth.Promise;

//mongo
var db_url = process.env.MONGOHQ_URL || 'mongodb://localhost/test'
mongoose.connect(db_url);

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    id        : String
  , score     : Number
});

UserSchema.plugin(mongooseAuth, {
  everymodule: {
    everyauth: {
      User: function() {
        return User;
      }
    }
  },

  twitter: {
    everyauth: {
      myHostname: 'http://dctechdcrap.herokuapp.com/',
      consumerKey: 'dfrfRrhx2uIYXvwPGH3sPg',
      consumerSecret: 'zKLEOknTpb5e0ZzlWXcdU19nJj2RkcvCLqO9wQVr70',
      redirectPath: '/'
    }
  }
});


mongoose.model('User', UserSchema); 
User = mongoose.model('User');

    
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
  app.use(express.cookieParser()); 
  app.use(express.session({secret: 'dctech'}));
  app.use(mongooseAuth.middleware());
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

//Twitter Oauth
app.get('/leaderboard/', function(req, res){
  res.render('leaderboard')
});














