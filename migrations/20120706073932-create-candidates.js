var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('candidates', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: { type: 'string', length: 100, notNull: true, unique: true},
    email: { type: 'string', length: 100, unique: true},
    phone: { type: 'string', length: 20},
    recruiter: { type: 'string', length: 100},
    stage: { type: 'string', length: 20}
  }, callback)
};

exports.down = function(db, callback) {
  db.dropTable('candidates', callback);
};
