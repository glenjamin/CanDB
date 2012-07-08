var forms = require('forms');

module.exports = function(app) {
  var data = app.data('candidates');

  var exports = {};

  var form = function(){ return forms.create({
    name: forms.fields.string({required: true}),
    email: forms.fields.email({required: true}),
    phone: forms.fields.string(),
    recruiter: forms.fields.string(),
  })};

  exports.index = function(req, res, next) {
    data.mapper.all(function(err, candidates) {
      if (err) return next(err);
      if (candidates.length) {
        res.render('candidates/list', { candidates: candidates });
      } else {
        res.render('candidates/list-empty');
      }
    })
  }

  exports.new = function(req, res, next) {
    res.render('candidates/new', {form: form()});
  }

  exports.create = function(req, res, next) {
    var bound = form().bind(req.body);
    bound.validate(function(err) {
      if (!bound.isValid()) {
        return res.render('candidates/new', {form: bound});
      }
      var model = data.model.create(bound.data)
      data.mapper.save(model, function(err, candidate) {
        if (err) {
          req.flash('error', 'Failed to Add Candidate: ' + err.message);
          res.render('candidates/new', {form: bound});
        } else {
          req.flash('info', 'New Candidate Added');
          res.render('candidates/show', {candidate: candidate});
        }
      })
    })
  }

  exports.load = function(req, id, callback) {
    data.mapper.get(id, callback);
  }

  return exports;
}
