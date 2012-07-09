
module.exports = function(app) {

  app.get('/', function(req, res){
    res.render('dash');
  });

  var candidates = require('./candidates')(app);
  var cResource = app.resource('candidates', candidates);
  cResource.get('delete', candidates.delete);

}
