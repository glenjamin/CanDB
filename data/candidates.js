var util = require('util');

module.exports = function(db) {

  var mapper = {}, model = {};

  var pk = 'id';
  var fields = ['name', 'email', 'phone', 'recruiter', 'stage'];
  mapper.all = function all(callback) {
    db.all("SELECT * FROM candidates ORDER BY ID DESC", function(err, rows) {
      callback(err, rows && rows.map(model.create));
    });
  }
  mapper.isNew = function(model) {
    return !model[pk];
  }
  mapper.save = function save(model, callback) {
    if (mapper.isNew(model)) {
      return insert(model, callback);
    } else {
      return update(model, callback);
    }
  }
  function backtick(s) { return '`'+s+'`'; }
  function param() { return '?'; }
  function insert(model, callback) {
    var sql = util.format(
      "INSERT INTO candidates(%s) VALUES (%s)",
      fields.map(backtick).join(', '),
      fields.map(param).join(', ')
    );
    var values = fields.map(function(f) { return model[f] })
    db.run(sql, values, function(err) {
      if (err) return callback(err);
      model[pk] = this.lastID;
      return callback(null, model);
    })
  }

  model.class = Candidate;
  model.create = function create(row) {
    return new Candidate(row);
  }


  return {mapper: mapper, model: model};
}

Candidate.prototype.fields = [
  'id', 'name', 'email', 'phone', 'recruiter', 'stage'
];
function Candidate(values) {
  this.update_attributes(values);
}
Candidate.prototype.update_attributes = function(values) {
  var c = this;
  Object.keys(values).forEach(function(field) {
    if (~c.fields.indexOf(field)) {
      c[field] = values[field];
    }
  })
}
