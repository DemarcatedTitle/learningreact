const addGameHistory = require('./bookshelf.js').addGameHistory;
exports.join = function(room) {
  const {
    JWT,
    userToken,
    secret,
    io,
    forfeitPrevious,
    socket,
    games,
    gameInit,
    users,
    rooms,
    chatters,
    chatlogs,
    gameUpdates,
    activePlayers,
    gameHistory,
    keypress,
  } = this;

  const currentRoom = room;
  JWT.verify(userToken, secret, function(err, decoded) {
    if (err) {
      io.to(socket.id).emit('error', 'Something went wrong');
    } else if (decoded.username) {
      forfeitPrevious(decoded.username, socket, currentRoom);
      io.in(currentRoom).clients(function(error, clients) {
        if (!clients.includes(users)) {
          socket.to(room).emit('userJoined', chatters.get(socket.id));
        }
      });
      socket.join(room, () => {
        if (games.get(room).players.get(decoded.username) !== 0) {
          let tempState = gameInit();
          games.get(room).players.set(decoded.username, 1);
          tempState.players = games.get(room).players;
          games.set(currentRoom, tempState);
        } else {
        }
        io.to(socket.id).emit(
          'rooms',
          JSON.stringify({
            rooms: Array.from(rooms.keys()),
            currentRoom: room,
          })
        );
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
        io.to(socket.id).emit(
          'chat message',
          JSON.stringify({
            room: room,
            logs: chatlogs.get(room),
          })
        );
        // const state = gameInit();
        // state.players = new Map([[decoded.username, 0]]);
        // games.set(currentRoom, state);

        let state = games.get(currentRoom);
        gameUpdates(socket, state, decoded.username, room);
        activePlayers.set(decoded.username, currentRoom);
      });
      let context = {
        room,
        username: decoded.username,
        io,
        socket,
      };
      function recursiveSecondsTimer(cb, seconds) {
        let state = games.get(currentRoom);
        if (seconds > 0 && state.outcome === undefined) {
          console.log(seconds);
          cb(seconds);
          return setTimeout(recursiveSecondsTimer, 1000, cb, seconds - 1);
        } else if (state.outcome === undefined) {
          function winning(coords, players) {
            if (coords.get(0).size === coords.get(1).size) {
              return 'draw';
            } else if (coords.get(0).size > coords.get(1).size) {
              return 0;
            } else {
              return 1;
            }
          }
          function whichPlayer(number, players) {
            const playerArr = Array.from(players);
            playerArr.map(function(currentValue, index, array) {
              if (currentValue[1] === number) {
                const winner = currentValue[0];
                const outcome = `${winner} is the winner`;
                const playersHistory = Array.from(players.keys());
                state.outcome = outcome;

                addGameHistory(
                  playersHistory[0],
                  playersHistory[1],
                  winner
                ).then(val => console.log(val));
              }
            });
          }
          whichPlayer(winning(state.coords, state.players), state.players);
          io.to(currentRoom).emit('outcome', "Time's up!");
          function delayedOutcome() {
            io.to(currentRoom).emit('outcome', state.outcome);
          }
          setTimeout(delayedOutcome, 1000);
        }
      }
      function timerEmit(seconds) {
        io.to(currentRoom).emit('outcome', `${seconds}`);
      }
      if (typeof games.get(room).players.get(decoded.username) === 'number') {
        socket.removeAllListeners('keypress');
        socket.on('keypress', keypress.bind(context));
      } else if (
        // If there is an available slot and you aren't in the game
        games.get(room).players.get(decoded.username) === undefined &&
        games.get(room).players.size < 2
      ) {
        // This seems like the ideal spot to place the timer
        recursiveSecondsTimer(timerEmit, 60);
        socket.removeAllListeners('keypress');
        socket.on('keypress', keypress.bind(context));
      } else if (
        games.get(room).players.get(decoded.username) === undefined &&
        games.get(room).players.size < 2
      ) {
        // socket.removeAllListeners("keypress");
        socket.on('keypress', keypress.bind(context));
      }
    }
  });
};
