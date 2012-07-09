var util = require('util');

module.exports = function(log, db) {

  // The named functions are for better stack traces!
  var mapper = new (function CandidateMapper(){});
  var model = new (function CandidateModel(){});

  var table = 'candidates';
  var pk = 'id';
  var fields = ['name', 'email', 'phone', 'recruiter', 'stage'];
  mapper.all = function all(callback) {
    var sql = util.format("SELECT * FROM %s ORDER BY %s DESC", table, pk)
    log.db(sql);
    db.all(sql, function(err, rows) {
      callback(err, rows && rows.map(model.create));
    });
  }
  mapper.get = function get(id, callback) {
    var sql = util.format("SELECT * FROM %s WHERE %s = ?", table, pk);
    log.db(sql, id);
    db.get(sql, id, function(err, row) {
      callback(err, row && model.load(row))
    })
  }
  mapper.save = function save(instance, callback) {
    if (model.isNew(instance)) {
      return insert(instance, callback);
    } else {
      return update(instance, callback);
    }
  }
  mapper.del = function del(model, callback) {
    var id = model[pk];
    var sql = util.format("DELETE FROM %s WHERE %s = ?", table, pk);
    log.db(sql, id);
    db.run(sql, id, function(err) {
      if (!err && !this.changes) err = new Error('Record not found');
      return callback(err);
    })
  }


  function insert(model, callback) {
    var sql = util.format(
      "INSERT INTO candidates(%s) VALUES (%s)",
      fields.map(function(s) { return '`'+s+'`'; }).join(', '),
      fields.map(function() { return '?'; }).join(', ')
    );
    var values = fields.map(function(f) { return model[f] })
    log.db(sql, values);
    db.run(sql, values, function(err) {
      if (err) return callback(err);
      model[pk] = this.lastID;
      return callback(null, model);
    })
  }
  function update(model, callback) {
    var sql = util.format(
      "UPDATE candidates SET %s WHERE %s = ?",
      fields.map(function(s) { return '`'+s+'` = ?'; }).join(', '),
      pk
    );
    var values = fields.concat('id').map(function(f) { return model[f] })
    log.db(sql, values);
    db.run(sql, values, function(err) {
      if (err) return callback(err);
      if (!this.changes) callback(new Error('Record not found'));
      return callback(null, model);
    })
  }

  model.class = function Candidate() {};
  model.create = function create(row) {
    var c = new model.class();
    model.set_defaults(c);
    model.update_attributes(c, row);
    return c;
  }
  model.load = function(row) {
    var c = new model.class()
    model.update_attributes(c, row);
    return c;
  }
  model.isNew = function(model) {
    return !model[pk];
  }
  model.set_defaults = function(c) {
    c.stage = 'new';
  }
  model.update_attributes = function(c, values) {
    Object.keys(values).forEach(function(field) {
      if (field == pk || ~fields.indexOf(field)) {
        c[field] = values[field];
      }
    })
  }

  return {mapper: mapper, model: model};
}
