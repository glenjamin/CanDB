var present = require('present-express');
var Candidate = require('./candidate');

module.exports = present.extend(Candidate, function(data) {
  this.template = 'candidates/list-empty';
})
