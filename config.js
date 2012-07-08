var sqlite3 = require('sqlite3');

var dbfile = __dirname + '/db.sqlite';
exports.db = new sqlite3.Database(dbfile);

// For db-migrate
exports.default = 'development';
exports.development = {
  driver: 'sqlite3',
  db: exports.db
}
