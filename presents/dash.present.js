var present = require('present-express');
var Base = require('./base');

module.exports = present.extend(Base, function(data) {
    this.data.title = 'Dashboard';
})
