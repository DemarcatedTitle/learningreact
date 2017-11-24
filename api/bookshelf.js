const bcrypt = require('bcrypt');
const Boom = require('boom');
const JWT = require('jsonwebtoken');
const secret = 'nevershareyoursecret';
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

// const knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: './walkgrid.sqlite',
//   },
// });
var bookshelf = new require('bookshelf')(knex);
var User = bookshelf.Model.extend({
  tableName: 'users',
});
const Gamehistory = bookshelf.Model.extend({
  tableName: 'gamehistory',
  hasTimestamps: true,
});
exports.bookshelf = bookshelf;
exports.jwtCheck = function(username, id) {
  return User.where('name', username)
    .fetch()
    .then(function(user) {
      return user;
    });
};
exports.profile = function profile(credentials, info) {
  const Profile = bookshelf.Model.extend({
    tableName: 'profiles',
    hasTimestamps: true,
  });
  return Profile.where({ player_id: credentials.id })
    .fetch()
    .then(function(result) {
      const exists = result === null ? false : true;
      return new Profile()
        .where({ player_id: credentials.id })
        .save(
          {
            player_id: credentials.id,
            bio: info.bio,
            location: info.located_at,
            favorite_game: info.favorite_game,
          },
          { patch: exists }
        )
        .then(function(data) {
          return 'Saved!';
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  console.log(credentials);
};
exports.registerUser = function registerUser(request, reply) {
  bcrypt.hash(request.payload.password, 10, function(err, hash) {
    if (err) {
      reply(err);
    } else {
      User.forge({
        name: request.payload.username,
        password: hash,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      })
        .save()
        .then(function(model) {
          reply({ text: 'success' });
        });
    }
  });
};
exports.login = function login(request, reply) {
  var User = bookshelf.Model.extend({ tableName: 'users' });
  User.where('name', request.payload.username)
    .fetch()
    .then(function(user) {
      if (user === null) {
        return reply(
          Boom.unauthorized('Something went wrong, please try logging in')
        );
      } else {
        bcrypt.compare(
          request.payload.password,
          user.attributes.password,
          function(err, res) {
            if (res === true) {
              console.log(user.attributes);
              var token = JWT.sign(
                { username: request.payload.username, id: user.attributes.id },
                secret,
                {
                  expiresIn: 1000000000,
                }
              );
              return reply({
                username: user.attributes.name,
                idtoken: token,
              });
            } else {
              return reply(
                Boom.unauthorized('Something went wrong, please try logging in')
              );
            }
          }
        );
      }
    })
    .catch(function(err) {
      console.log('\n\nErr\n\n');
      console.log(err);
    });
};

exports.addGameHistory = function addGameHistory(player1, player2, winner) {
  return User.query(function(qb) {
    qb.where('name', '=', player2).orWhere('name', '=', player1);
  })
    .fetchAll()
    .then(function(users) {
      console.log('addGameHistory');
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
