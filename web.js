
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    mongoose = require('mongoose'),
    OAuth = require('oauth').OAuth;

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
var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"YourConsumerKeyProvidedByTwitter",
	"zKLEOknTpb5e0ZzlWXcdU19nJj2RkcvCLqO9wQVr70",
	"1.0",
	"http://yourdomain/auth/twitter/callback",
	"HMAC-SHA1"
);

app.get('/auth/twitter', function(req, res){
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			console.log(error);
			res.send("yeah no. didn't work.")
		}
		else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + req.session.oauth.token);
			req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
	}
	});
});

app.get('/auth/twitter/callback', function(req, res, next){
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;

		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send(error);
				res.send("yeah something broke.");
			} else {
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth,access_token_secret = oauth_access_token_secret;
				console.log(results);
				res.send("worked. nice one.");
			}
		}
		);
	} else
		next(new Error("you're not supposed to be here."))
});

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);
















