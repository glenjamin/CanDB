
module.exports = function(app) {

  app.get('/', function(req, res){
    res.render('dash');
  });

  app.resource('candidates', require('./candidates')(app));

}
