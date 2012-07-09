var present = require('present-express');
var Candidate = require('./candidate');

module.exports = present.extend(Candidate, function(data) {
  this.template = 'delete';

  var c = data.candidate;
  this.data.form = {
    prompt: 'Are you sure you want to delete candidate "'+c.name+'"?',
    action: '/candidates/' + data.candidate.id,
    fields: this.renderForm('DELETE'),
  }
})
