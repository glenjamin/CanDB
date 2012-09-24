var present = require('present-express');
var Candidate = require('./candidate');

module.exports = present.extend(Candidate, function(data) {
  this.template = 'candidates/show';

  var c = data.candidate;
  this.data.candidate = {
    'name': c.name,
    'recruiter': c.recruiter,
    'email': c.email,
    'phone': c.phone,
    'stage': Candidate.friendlyStage(c)
  };
})
