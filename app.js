
/**
 * Module dependencies.
 */

var http = require('http');

var express = require('express');
require('express-resource');

var app = express();

app.configure(function(){
  var config = require('./config');

  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'present.js');
  app.set('views', __dirname + '/presents');

  app.engine('present.js', require('present-express').init({
      'ext': 'present.js',
      'templates': __dirname + '/templates',
      'template-ext': 'tache'
  }));

  app.set('db', config.db);

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('pwiefjhsdofhsdlfksd'));
  app.use(express.cookieSession({ key: 'sid' }));

  // CSRF Protection
  app.use(express.csrf());
  app.use(function(req, res, next) {
    res.locals.csrf = req.session._csrf;
    next();
  })

  // Flash Messages
  app.use(require('connect-flash')());
  app.use(function(req, res, next) {
    res.locals.flash = function() { return req.flash() };
    next();
  })

  app.use(app.router);

  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.data = function(resource) {
  if (!app.data.cache[resource]) {
    app.data.cache[resource] = require('./data/' + resource)(app.get('db'));
  }
  return app.data.cache[resource];
}
app.data.cache = {}

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
