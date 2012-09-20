
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
  app.use(express.cookieParser()); 
  app.use(express.session({secret: 'dctech'}));
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

//get score post
app.post('/user/new', function(req, res) {
    console.log(req.body);
    var user_obj = req.body
    var saveUser = new User(); 
        saveUser.id = user_obj.id;
        saveUser.score = user_obj.score;
        saveUser.name = user_obj.name;
        saveUser.img_url = user_obj.img_url;
         
        saveUser.save(function(err, users){
            console.log(saveUser);
        });
    
    res.send('Data received: ' + JSON.stringify(req.body));
});



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
    id        : Number
  , score     : Number
  , name  : String
  , img_url: String
});

mongoose.model('User', UserSchema); 
var User = mongoose.model('User');

//get list of users
app.get('/user/list.json', function(req, res) {
  User.find.sort('score', -1).all(function (err, users) {
    res.send(users);
  });
});






