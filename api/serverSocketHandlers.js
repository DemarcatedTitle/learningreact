/* eslint-disable no-console */
/* eslint-disable indent */
// const { List, fromJS } = require("immutable");
const keypress = require('./keypress.js').keypress;
const gameInit = require('./gameInit.js').gameInit;
// const moveSquare = require("./grid/stateChanges.js").moveSquare;
const join = require('./join').join;
const chatmessage = require('./chatmessage').chatmessage;
const newgame = require('./newgame').newgame;
const bookshelf = require('./index.js').bookshelf;
const addGameHistory = require('./bookshelf.js').addGameHistory;
const fetchGameHistory = require('./bookshelf.js').fetchGameHistory;
const {
  chatters,
  chatlogs,
  rooms,
  games,
  activePlayers,
  gameHistory,
} = require('./gamestate.js');
let io;
const JWT = require('jsonwebtoken');
const appendMessage = require('./appendMessage');
function chatMessageEmission(room, chatlogs) {
  return JSON.stringify({
    room: room,
    logs: chatlogs.get(room),
  });
}
function getCurrentRoom(socketid, activeUsersMap, chattersMap) {
  const username = chattersMap.get(socketid);
  const currentRoom = activeUsersMap.get(username);
  return currentRoom;
}
function forfeitPrevious(username, socket, currentRoom, reason) {
  if (activePlayers.has(username)) {
    let previousRoom = activePlayers.get(username);
    let outcome;
    if (!games.get(previousRoom).outcome) {
      const prevPlayers = games.get(previousRoom).players;
      const winnerMap = new Map(prevPlayers);
      winnerMap.delete(username);
      const winner = winnerMap.keys().next().value;
      outcome = `${username} has forfeited, ${winner} is the winner!`;
      let players = Array.from(prevPlayers.keys());
      console.log(players);
      if (players.length > 1) {
        addGameHistory(players[0], players[1], winner).then(val =>
          console.log(val)
        );
      }
      games.get(previousRoom).outcome = outcome;
    } else {
      outcome = games.get(previousRoom).outcome;
    }
    io.in(previousRoom).emit('outcome', outcome);
    socket.leave(previousRoom, function(socket) {});
    io.in(previousRoom).clients((error, clients) => {
      if (error) throw error;
      if (clients.length === 0) {
        rooms.delete(previousRoom);
      }
      if (reason === 'tutorial') {
        socket.broadcast.emit(
          'rooms',
          JSON.stringify({
            rooms: Array.from(rooms.keys()),
          })
        );
      } else {
        if (clients.length === 0) {
          io.emit(
            'rooms',
            JSON.stringify({
              rooms: Array.from(rooms.keys()),
            })
          );
        }
      }
    });
  }
}

exports.io = function(listener, secret, users) {
  io = require('socket.io')(listener);

  io.use(function(socket, next) {
    const receivedToken = socket.handshake.query.token;
    JWT.verify(receivedToken, secret, function(err) {
      if (err) {
        console.log('io.use \n' + err);
        return next(
          new Error('Sorry, something went wrong. Please try logging in.')
        );
      } else {
        return next();
      }
    });
  });
  io.on('connection', function(socket, username) {
    function gameUpdates(socket, state, username, room) {
      io.in(room).emit('grid', state.grid);
      io.in(room).emit('coords', state.coords);
      io.in(room).emit('occupied', state.occupied);
      if (games.get(room).players.size === 1) {
        io.in(room).emit('outcome', 'Waiting');
      } else {
        io.in(room).emit('outcome', 'Game In Progress');
      }
      // The line below returns the "you" player number
      io.to(socket.id).emit('you', games.get(room).players.get(username));
    }
    let currentRoom = '';
    let userToken = socket.handshake.query.token;
    io.to(socket.id).emit(
      'rooms',
      JSON.stringify({
        rooms: Array.from(rooms.keys()),
        currentRoom: currentRoom,
      })
    );
    JWT.verify(userToken, secret, function(err, decoded) {
      chatters.set(socket.id, decoded.username);
      io.in(currentRoom).clients((error, clients) => {
        if (error) throw error;
        io.to(socket.id).emit(
          'users',
          JSON.stringify({
            users: clients.map(client => chatters.get(client)),
            currentUser: decoded.username,
          })
        );
      });
    });
    const socketContext = {
      appendMessage: appendMessage,
      chatMessageEmission: chatMessageEmission,
      getCurrentRoom: getCurrentRoom,
      JWT: JWT,
      userToken: userToken,
      secret: secret,
      io: io,
      forfeitPrevious: forfeitPrevious,
      socket: socket,
      games: games,
      gameInit: gameInit,
      users: users,
      rooms: rooms,
      chatters: chatters,
      chatlogs: chatlogs,
      gameUpdates: gameUpdates,
      activePlayers: activePlayers,
      gameHistory: gameHistory,
      keypress: keypress,
    };

    socket.on('disconnecting', function(reason) {
      console.log(reason);
      const roomsLeaving = Object.keys(socket.rooms);
      roomsLeaving.forEach(function(room) {
        console.log(`${chatters.get(socket.id)} just left`);
        socket.to(room).emit('userLeft', chatters.get(socket.id));
      });
      chatters.delete(socket.id);
    });
    socket.on('new room', newgame.bind(socketContext));
    socket.on('chat message', chatmessage.bind(socketContext));
    socket.on('join', join.bind(socketContext));
    socket.on('gameHistory', function(request) {
      console.log('gameHistory requested');
      fetchGameHistory().then(function(gamehistory) {
        const matches = Array.from(gamehistory);
        const gamehistoryResponse = matches.map(function(item) {
          return {
            players: [item.player1, item.player2],
            outcome: `${item.outcome} is the winner!`,
            date: item.created_at,
          };
        });

        io.to(socket.id).emit('gameHistory', gamehistoryResponse);
      });
    });
    console.log('connection');
  });
  const repl = require('repl');
  repl.start('> ').context.io = io;
};
