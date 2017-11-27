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
const verifyCreds = '';
const registerUser = '';
const bookshelf = require('./bookshelf.js');

// Things that should be in a sql database:
// Users
// History
//
// Things that should live in memory or maybe redis:
// Actual game state

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
function validate(decoded, request, callback) {
  // console.log('\n\n\nvalidate\n\n\n');
  try {
    bookshelf.jwtCheck(decoded.username, decoded.id).then(function(user) {
      if (user === null) {
        return callback(null, false);
      } else {
        return callback(null, true);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
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
      handler: bookshelf.registerUser,
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
      handler: bookshelf.login,
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
      method: 'get',
      path: '/api/profile/{user}',
      config: {
        auth: 'jwt',
      },
      handler: function(request, reply) {
        console.log(request.params);
        bookshelf.getProfile(request.params.user, reply);
      },
    },
    {
      method: 'POST',
      path: '/api/profile',
      config: {
        auth: 'jwt',
        validate: {
          payload: {
            bio: Joi.string()
              .min(0)
              .max(1000)
              .allow(''),
            location: Joi.string()
              .max(25)
              .allow(''),
            favorite_game: Joi.string()
              .max(20)
              .allow(''),
          },
        },
      },
      handler: function(request, reply) {
        bookshelf
          .writeProfile(request.auth.credentials, request.payload)
          .then(function(data) {
            return reply.response({ savedStatus: data });
          });
        // Save the profile entry here
      },
    },
    {
      method: 'GET',
      path: '/api/restricted',
      config: { auth: 'jwt' },
      handler: function(request, reply) {
        console.log('Someone made a request');
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
