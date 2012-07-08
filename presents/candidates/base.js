var present = require('present-express');
var Base = require('../base');

module.exports = present.extend(Base, function(data) {
    this.layout = [this.layout, 'candidates/layout'];
    this.data.title = 'Candidates';

    this.data.layout = {
      'new-url': '/candidates/new'
    };

    this.menu.activate('candidates');
})
