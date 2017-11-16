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
// var bookshelf = require('bookshelf')(knex);
// var User = bookshelf.Model.extend({ tableName: 'users' });
// var Users = bookshelf.Collection.extend({ model: User });
// const Gamehistory = bookshelf.Model.extend({
//   tableName: 'gamehistory',
//   hasTimestamps: true,
// });
// Users.forge([{ name: 'firstuser' }, { name: 'seconduser' }]);
// // User.query(function(qb) {
// //   qb.where('name', '=', 'firstuser').orWhere('name', '=', 'seconduser');
// // })
// //   .fetchAll()
// //   .then(function(user) {
// //     let usr = user.find(function(user) {
// //       return user.attributes.name === 'seconduser';
// //     });
// //     console.log(usr.attributes.id);
// //     // console.log(
// //     //   user.find(function(user) {
// //     //     return (user.attributes.name = 'Jack');
// //     //   }).attributes
// //     // );
// //   });
// const player1 = 'firstuser';
// const player2 = 'Jack';
// const winner = 'firstuser';
// Users.query(function(qb) {
//   qb.where('name', '=', player2).orWhere('name', '=', player1);
// })
//   .fetch()
//   .then(function(users) {
//     const pid1 = users.find(user => user.attributes.name === player1).attributes
//       .id;
//     const pid2 = users.find(user => user.attributes.name === player2).attributes
//       .id;

//     console.log(pid1);
//     console.log(pid2);
//     Gamehistory.forge({ pid1: pid1, pid2: pid2, outcome: winner })
//       .save()
//       .then();
//   });
