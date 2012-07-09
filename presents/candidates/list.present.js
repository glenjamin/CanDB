var present = require('present-express');
var Candidate = require('./candidate');

module.exports = present.extend(Candidate, function(data) {
  this.template = 'candidates/list';

  delete this.data.layout['list-url'];

  this.data.candidates = data.candidates.map(function(candidate) {
    return {
      id: candidate.id,
      name: candidate.name,
      recruiter: candidate.recruiter,
      stage: Candidate.friendlyStage(candidate),
      actions: {
        show: '/candidates/' + candidate.id,
        edit: '/candidates/' + candidate.id + '/edit',
        delete: '/candidates/' + candidate.id + '/delete'
      }
    }
  });
})
