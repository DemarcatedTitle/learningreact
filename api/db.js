// const knex = require('knex')({
//   client: 'pg',
//   connection: {
//     host: 'localhost',
//     user: 'postgres',
//     password: 'root',
//     database: 'postgres',
//     port: 5432,
//   },
// });
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './walkgrid.sqlite',
  },
});
knex.schema
  .createTable('users', function(table) {
    table.increments();
    table.string('name');
    table.string('password');
    table.timestamps();
  })
  .then(table => table);
knex.schema
  .createTable('gamehistory', function(table) {
    table.increments();
    table.integer('pid1');
    table.integer('pid2');
    table.string('outcome');
    table.timestamps();
  })
  .then(table => table);
