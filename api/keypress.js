const moveSquare = require('./grid/stateChanges.js').moveSquare;
const addGameHistory = require('./bookshelf.js').addGameHistory;
const bookshelf = require('./index.js').bookshelf;
const {
  chatters,
  chatlogs,
  rooms,
  games,
  activePlayers,
  gameHistory,
} = require('./gamestate.js');
function changeState(state, player, direction) {
  return new Promise(resolve => {
    let tempState = moveSquare(state, player, direction);
    if (tempState.coords) {
      state.coords = tempState.coords;
    }
    if (tempState.occupied) {
      state.occupied = tempState.occupied;
    }
    if (tempState.collision) {
      state.collision = tempState.collision;
    }
    resolve(state);
  });
}
exports.keypress = function keypress(key) {
  return new Promise(resolve => {
    let currentRoom = this.room;
    let username = this.username;
    let io = this.io;
    let socket = this.socket;
    let state = games.get(currentRoom);
    const keyConfigs = new Map([
      ['w', 'up'],
      ['s', 'down'],
      ['a', 'left'],
      ['d', 'right'],
    ]);

    let newState;
    function frontUpdate(key) {
      console.log(`keypress key: ${key}`);
      return new Promise(resolve => {
        if (state.collision === undefined && !state.outcome) {
          newState = changeState(
            state,
            games.get(currentRoom).players.get(username),
            keyConfigs.get(key)
          );
        }
        if (state.outcome) {
          io.in(currentRoom).emit('outcome', state.outcome);
          socket.removeAllListeners('keypress');
        }

        io.in(currentRoom).emit('coords', state.coords);
        io.in(currentRoom).emit('occupied', state.occupied);
        if (state.collision) {
          console.log('Collision Detected');
          if (!state.outcome) {
            const winnerMap = new Map(state.players);
            winnerMap.delete(username);
            const winner = winnerMap.keys().next().value;
            const outcome = `${winner} is the winner!`;
            state.outcome = outcome;
            console.log(Array.from(state.players.keys()));
            const players = Array.from(state.players.keys());

            addGameHistory(players[0], players[1], winner).then(val =>
              console.log(val)
            );
            // gameHistory.push({
            //   date: new Date(),
            //   players: Array.from(state.players.keys()),
            //   outcome: outcome,
            // });
          }
          // io.in(currentRoom).clients((error, clients) => {
          //     if (error) throw error;
          //     clients.map(function (client) {

          //     })
          // });
          io.in(currentRoom).emit('outcome', state.outcome);
          socket.removeAllListeners('keypress');
        }
        newState.then(data => resolve(data));
        // resolve(newState);
      });
    }
    frontUpdate(key).then(data => resolve(data));
  });
};
