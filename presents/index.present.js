var present = require('present-express');
var Base = require('./base');

module.exports = present.extend(Base, function(data) {
    if (data.title) {
        this.data.title = data.title;
    }
})
