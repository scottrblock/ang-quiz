function censor(censor) {
  return (function() {
    var i = 0;

    return function(key, value) {
      if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
        return '[Circular]'; 

      if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
        return '[Unknown]';

      ++i; // so we know we aren't using the original object anymore

      return value;  
    }
  })(censor);
}
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
    console.log(req);
    res.send('Data received: ' + JSON.stringify(req, censor(req))););
        
    /*
         var saveUser = new User(); 
             saveUser.id = id;
             saveUser.score = score;
             saveUser.name = name;
             saveUser.img_url = img_url;
             
             saveUser.save(function(err, users){
               console.log(saveUser);
             });
    */
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






