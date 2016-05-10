/**
 * Module dependencies
 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var morgan = require('morgan');
var routes = require('./routes/index');
var admin = require('./routes/admin');
var http = require('http');
var path = require('path');
var models = require('./models');
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session');
var app = module.exports = express();
var env = process.env.NODE_ENV || 'development';
var sess;
var http = require('http');

var authenticate = function(username, pass, callback) {
  models.users.find({
    where: {
       username: username
    }
  }).then(function (user) {
        
    // if the username couldn't be found
    if (!user) return callback(new Error('cannot find user')); 

    bcrypt.compare(pass, user.hash, function (err, res) {
      if(err) {
        return callback(err);
      } else if (res) {
        return callback(null, user)
      } else {
        callback(new Error('Invalid Password'));
      }
    });
     
  }).catch(function (err) {
        console.log(err);
  });
    
};

var requireLogin = function (req, res, next) {
  if (req.session.loggedIn) {
    next(); // allow the next route to run
  } else {
    // require the user to log in
    res.redirect('/nigol'); 
  }
};

var checkLogin = function (req, res, next) {
  if(req.session.loggedIn) {
    res.redirect('/admin/manageSurveys');
  } else {
    next();
  }
};

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (env === 'development') {
  app.use(errorhandler());
}

// production only
if (env === 'production') {
  // TODO
}

/**
 * Sequelize Configuration
 */

models.sequelize.sync().then(function() {
 var server = app.listen(app.get('port'), function() {
 console.log('Express server listening on port ' + server.address().port);
 });
});

/**
 * Session middleware
 */

app.use(session({
  saveUninitialized: true,
  resave: false, 
  rolling: true,
  secret: 'sumo cream!'
}));

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

app.set('models', require('./models'));


/**
 * Routes
 */

app.get('/', function(req, res) {
    sess = req.session;
    res.redirect('survey');
});

app.get('/survey', routes.index);

app.get('/nigol', checkLogin,routes.login);


/**
 * Automatically apply the `requireLogin` middleware to all
 * routes starting with `/admin`
 */
app.all("/admin/*", requireLogin, function(req, res, next) {
    // if middleware allows us to get here, move onto next
    next(); 
});

app.get('/admin', function (req, res) {
    res.redirect('/admin/manageSurveys');
});

app.get('/admin/manageSurveys', admin.manageSurveys);

app.get('/admin/viewResponses', admin.viewResponses);

/** 
 * DB Requests
 */

app.post('/answers', routes.getAnswers);

app.get('/surveyQuestion', routes.getSurveyQuestion);

app.post('/recordResponse', routes.recordResponse);

app.get('/admin/getQuestions', admin.getQuestions);

app.post('/admin/addQuestion', admin.addQuestion);

app.post('/admin/updateSurvey', admin.updateSurvey);

app.post('/admin/deleteQuestions', admin.deleteQuestions);

app.post('/admin/updateAnswer', admin.updateAnswer);

app.post('/admin/getResponseCounts', admin.getResponseCounts);

// logout 
app.get('/logout', function (req, res) {
  sess = req.session;
  sess.loggedIn = false;
  res.redirect('survey');
})

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

app.post('/nigolAuthenticate', function (req, res) { 
  authenticate(req.body.username, req.body.password, function (err, user) {
    sess = req.session;
    if(user) {
      sess.user = user;
      sess.success = 'Authenticated as ' + user.username;
      sess.loggedIn = true;
      res.redirect('/admin/manageSurveys');
    } else {
      sess.error = 'Authentication failed'
      sess.loggedIn = false; 
      res.redirect('nigol');
    }
  });
});