var present = require('present-express');
var Base = require('./base');

module.exports = present.extend(Base, function(data) {
  this.template = 'candidates/new';

  // Disable New Link
  this.data.layout['new-url'] = false;

  this.data.form = {
    action: '/candidates',
    fields: this.renderForm(data.form),
  }
})
