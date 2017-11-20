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

var server = new Hapi.Server({});
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
server.connection({ port: 8000, labels: 'login' });
const login = server.select('login');
login.register([Inert, require('hapi-auth-jwt2')], function(err) {
  if (err) {
    console.log(err);
  }
  login.auth.strategy('jwt', 'jwt', {
    key: secret,
    validateFunc: validate,
  });
  // login.auth.default('jwt');
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
    {
      method: 'GET',
      path: '/static/{param*}',
      handler: {
        directory: {
          path: path.join(__dirname, 'build/static'),
          redirectToSlash: true,
          index: true,
          listing: false,
        },
      },
    },
    {
      method: 'GET',
      path: '/{param*}',
      handler: {
        file: path.join(__dirname, 'build/index.html'),
      },
    },
  ]);
});

socketHandlers.io(login.listener, secret);

server.start(err => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
exports.bookshelf = bookshelf;
