const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'postgres',
    port: 5432,
  },
});
var bookshelf = new require('bookshelf')(knex);
var User = bookshelf.Model.extend({
  tableName: 'users',
});
const Gamehistory = bookshelf.Model.extend({
  tableName: 'gamehistory',
  hasTimestamps: true,
});

exports.addGameHistory = function addGameHistory(player1, player2, winner) {
  return User.query(function(qb) {
    qb.where('name', '=', player2).orWhere('name', '=', player1);
  })
    .fetchAll()
    .then(function(users) {
      console.log('addGameHistory');
      // I broke something here where pid2 doesn't get saved
      const pid1 = users.find(user => user.attributes.name === player1)
        .attributes.id;
      const pid2 = users.find(user => user.attributes.name === player2)
        .attributes.id;
      Gamehistory.forge({ pid1: pid1, pid2: pid2, outcome: winner })
        .save()
        .then();
    });
};
// Returns JSON of the game history table
// selecting for player1, player2, outcome, create_at
exports.fetchGameHistory = function fetchGameHistory() {
  try {
    var Matches = bookshelf.Model.extend({
      tableName: 'gamehistory',
    });
    return Matches.query(function(qb) {
      qb
        .join('users as users_a', 'users_a.id', 'pid1')
        .join('users as users_b', 'users_b.id', '=', 'pid2')
        .select(
          'users_a.name as player1',
          'users_b.name as player2',
          'gamehistory.outcome',
          'gamehistory.created_at'
        );
    })
      .fetchAll()
      .then(function(collection) {
        return collection.toJSON();
      });
  } catch (error) {
    console.log(error);
  }
};
