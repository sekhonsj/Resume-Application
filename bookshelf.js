const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: '5432',
    user: 'sukhrajsekhon',
    password: '',
    database: 'postgres',
    charset: 'utf8'
  }
})
const bookshelf = require('bookshelf')(knex);
bookshelf.plugin(require('bookshelf-soft-delete'));

const positions = bookshelf.Model.extend({
  tableName: 'positions'
});

const applicants = bookshelf.Model.extend({
  tableName: 'applicants',
  soft: ['is_deleted']
});

const manager = bookshelf.Model.extend({
  tableName: 'manager'
});

exports._bookshelf = bookshelf;
exports.positions = positions;
exports.applicants = applicants;
exports.manager = manager;
