

/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorhandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  models = require('./models');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

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



app.set('models', require('./models'));
//var User = app.get('models').User;

app.post('/answers', routes.getAnswers);
app.get('/questions', routes.getQuestions);
//app.get('/answers',function(req, res) {
//    models.Answers.findAll().then(function(answers){
//        res.json(answers);
//    });
    
//new Sequelize.Utils.QueryChainer()
//  .add(Answers, 'findAll')
//  .error(function(err) { /* hmm not good :> */ })
//  .success(function(results) {
//    var answer = results[0];
//  });
//});
/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

//http.createServer(app).listen(app.get('port'), function () {
//  console.log('Express server listening on port ' + app.get('port'));
//});
