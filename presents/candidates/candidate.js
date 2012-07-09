var present = require('present-express');
var Base = require('../base');

exports = module.exports = present.extend(Base, function(data) {
    this.layout = [this.layout, 'candidates/layout'];
    this.data.page = 'Candidates';

    this.data.layout = {
      'list-url': '/candidates',
      'new-url': '/candidates/new'
    };
    Object.defineProperty(this.data, 'has-links', {
      get: function() { return Object.keys(this).length > 1 },
      enumerable: true
    })

    this.menu.activate('candidates');
})

exports.friendlyStage = function(model) {
  return {
    'new': 'New',
  }[model.stage];
}
