var present = require('present-express');
var Candidate = require('./candidate');

module.exports = present.extend(Candidate, function(data) {
  this.template = 'candidates/edit';

  // Disable New Link
  this.data.layout['new-url'] = false;

  this.data.form = {
    action: '/candidates/' + data.candidate.id,
    fields: this.renderForm(data.form, 'PUT'),
  }
})
