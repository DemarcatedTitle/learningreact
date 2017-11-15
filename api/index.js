/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
const { List, fromJS } = require('immutable');
const Hapi = require('hapi');
const Boom = require('boom');
const Joi = require('joi');
const Inert = require('inert');
const path = require('path');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'nevershareyoursecret';
const socketHandlers = require('./serverSocketHandlers.js');
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
var bookshelf = require('bookshelf')(knex);

const User = bookshelf.Model.extend({ tableName: 'users' });

// Things that should be in a sql database:
// Users
// History
//
// Things that should live in memory or maybe redis:
// Actual game state

// const users = new Map();
var server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'html'),
      },
    },
  },
});
// Need to put bookshelf name lookup here
// I believe this is not getting called because front end routing is using react router, unrelated to this server.
var validate = function(decoded, request, callback) {
  console.log('\n\n\nvalidate\n\n\n');
  var User = bookshelf.Model.extend({ tableName: 'users' });
  User.where('name', decoded.username)
    .fetch()
    .then(function(user) {
      console.log('\n\n\nvalidate');
      console.log(user);
    })
    .catch(function(err) {
      console.log('\n\nerr\n\n');
      console.log(err);
    });
  console.log(decoded);
  if (!users[decoded.username]) {
    return callback(null, false);
  } else {
    return callback(null, true);
  }
};
server.register(Inert, () => {});
server.connection({ port: 8000, labels: 'login' });
const login = server.select('login');
login.register(require('hapi-auth-jwt2'), function(err) {
  if (err) {
    console.log(err);
  }
  login.auth.strategy('jwt', 'jwt', {
    key: secret,
    validateFunc: validate,
  });
  login.auth.default('jwt');
  login.route([
    {
      // This is where we will log in
      // On the front-end react side you submit the form
      // and it uses fetch() to post to this route
      //
      // And here it will be something like:
      // if request.payload stuff === userinfo
      // return jwt
      method: 'POST',
      path: '/api/register',
      config: {
        auth: false,
        validate: {
          payload: {
            username: Joi.string()
              .min(3)
              .max(76),
            password: Joi.string().min(6),
          },
        },
      },
      handler: function(request, reply) {
        bcrypt.hash(request.payload.password, 10, function(err, hash) {
          if (err) {
            reply(err);
          } else {
            User.forge(
              {
                name: request.payload.username,
                password: hash,
              },
              { hasTimestamps: true }
            )
              .save()
              .then(function(model) {
                reply({ text: 'success' });
              });
          }
        });
      },
    },
    {
      // This is where we will log in
      // On the front-end react side you submit the form
      // and it uses fetch() to post to this route
      //
      // And here it will be something like:
      // if request.payload stuff === userinfo
      // return jwt
      method: 'POST',
      path: '/api/auth',
      config: { auth: false },
      handler: function(request, reply) {
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
                    var token = JWT.sign(
                      { username: request.payload.username },
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
                      Boom.unauthorized(
                        'Something went wrong, please try logging in'
                      )
                    );
                  }
                }
              );
            }
          })
          .catch(function(err) {
            console.log('\n\nerr\n\n');
            console.log(err);
          });
        // Set expiresIn to a long time to work on front end things.
        // function authenticate(username, password) {
        //   bcrypt.compare(
        //     password,
        //     users.get(request.payload.username).password,
        //     function(err, res) {
        //       if (res === true) {
        //         return reply({
        //           username: username,
        //           idtoken: token,
        //         });
        //       } else {
        //         return reply(
        //           Boom.unauthorized(
        //             'Something went wrong, please try logging in'
        //           )
        //         );
        //       }
        //     }
        //   );
        // }
        // return authenticate(request.payload.username, request.payload.password);
      },
    },
    {
      method: 'GET',
      path: '/api/auth/jwt',
      handler: function(request, reply) {
        // Use this function to return true or false based on if the jwt is good
        // request.payload.idtoken;
        reply({ text: 'success' });
      },
    },
    {
      method: 'GET',
      path: '/noauth',
      config: { auth: false },
      handler: function(request, reply) {
        return reply.response({ test: 'test' });
      },
    },
    {
      method: 'GET',
      path: '/api/restricted',
      config: { auth: 'jwt' },
      handler: function(request, reply) {
        reply('success');
      },
    },
  ]);
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
let grid = [];
function gridInit(x, y) {
  for (let i = 0; i < x; i++) {
    let yArray = [];
    for (let j = 0; j < y; j++) {
      yArray.push([i, j]);
    }
    grid.push(yArray);
  }
}
gridInit(14, 14);
const gridHeight = grid.length;
let occupied = [];
for (let i = 0; i < 25; i += 1) {
  occupied.push([getRandomInt(0, gridHeight), getRandomInt(0, gridHeight)]);
}
let outsideState;
const playerOneStart = [
  parseInt(grid.length / 2, 10),
  parseInt(grid[1].length / 2, 10),
];
const playerTwoStart = [
  parseInt(grid.length / 2, 10),
  parseInt(grid[1].length / 2, 10),
];
const startingPoints = fromJS([
  [
    playerOneStart,
    [playerOneStart[0], playerOneStart[1] - 1],
    [playerOneStart[0], playerOneStart[1] - 1],
  ],
  [playerTwoStart],
]);
outsideState = {
  coords: startingPoints,
  occupied: fromJS(occupied),
  animated: false,
};
// let isKeydownAvailable = true;
grid = fromJS(grid);
socketHandlers.io(login.listener, secret);

server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
exports.bookshelf = bookshelf;
