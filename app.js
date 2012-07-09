
/**
 * Module dependencies.
 */

var http = require('http');

var express = require('express');
require('express-resource');

var app = express();

var winston = require('winston');
app.log = new (winston.Logger)({
  transports: [new (winston.transports.Console)({colorize: true})]
});
app.log.db = function(sql) {
  var str = "Database - " + sql;
  if (arguments.length > 1) {
    var args = Array.isArray(arguments[1]) ?
      arguments[1] : Array.prototype.slice.call(arguments, 1);
    str += "; " + JSON.stringify(args);
  }
  this.debug(str);
}
app.log.setLevels({ silly:0, verbose:1, debug: 2, info:3, warn:4, error:5});

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
  // Send connect logs through to winston (removing duplicate newline)
  app.use(express.logger({
    format: 'tiny',
    stream: { write: function(str){
      app.log.info(str.substring(0, str.length - 1))
    }}
  }));
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
  app.log.setLevels(winston.config.npm.levels);
  app.use(express.errorHandler());
});

app.data = function(resource) {
  if (!app.data.cache[resource]) {
    var module = require('./data/' + resource)(app.log, app.get('db'));
    app.data.cache[resource] = module;
  }
  return app.data.cache[resource];
}
app.data.cache = {}

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
