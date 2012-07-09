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

  exports.show = function(req, res, next) {
    res.render('candidates/show', { candidate: req.candidate });
  }

  exports.new = function(req, res, next) {
    res.render('candidates/new', {form: form()});
  }

  exports.create = function(req, res, next) {
    var bound = form().bind(req.body);
    bound.validate(function(err) {
      if (err || !bound.isValid()) {
        return fail(err ? err.message : 'Failed validation');
      }

      var model = data.model.create(bound.data)
      data.mapper.save(model, function(err, model) {
        if (err) return fail(err.message);

        req.flash('info', 'New Candidate Added');
        res.redirect('/candidates');
      })
    })
    function fail(message) {
      req.flash('error', 'Failed to Add Candidate: ' + message);
      res.render('candidates/new', {form: bound});
    }
  }

  exports.edit = function(req, res, next) {
    var model = req.candidate;
    var bound = form().bind(model);
    res.render('candidates/edit', { candidate: model, form: bound });
  }

  exports.update = function(req, res, next) {
    var model = req.candidate;
    var bound = form().bind(req.body);
    bound.validate(function(err) {
      if (err || !bound.isValid()) {
        return fail(err ? err.message : 'Failed validation');
      }

      data.model.update_attributes(model, bound.data);
      data.mapper.save(model, function(err, model) {
        if (err) return fail(err.message);

        req.flash('info', 'Candidate Saved');
        res.render('candidates/show', {candidate: model});
      })
    })
    function fail(message) {
      req.flash('error', 'Failed to Save Candidate: ' + message);
      res.render('candidates/edit', { candidate: model, form: bound });
    }
  }

  exports.delete = function(req, res, next) {
    res.render('candidates/delete', {candidate: req.candidate});
  }

  exports.destroy = function(req, res, next) {
    var model = req.candidate;
    data.mapper.del(model, function(err) {
      if (err) {
        req.flash('error', 'Failed to Delete Candidate: ' + err.message);
        return res.render('candidates/delete', {candidate: model})
      }
      req.flash('info', 'Candidate Deleted');
      res.redirect('/candidates');
    })
  }

  exports.load = function(req, id, callback) {
    data.mapper.get(id, callback);
  }

  return exports;
}
