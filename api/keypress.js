const moveSquare = require("./grid/stateChanges.js").moveSquare;
const {
    chatters,
    chatlogs,
    rooms,
    games,
    activePlayers,
    gameHistory
} = require("./gamestate.js");
function changeState(state, player, direction) {
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
}
exports.keypress = function keypress(key) {
    let currentRoom = this.currentRoom;
    let username = this.username;
    let io = this.io;
    let socket = this.socket;
    let state = games.get(currentRoom);
    const keyConfigs = new Map([
        ["w", "up"],
        ["s", "down"],
        ["a", "left"],
        ["d", "right"]
    ]);

    function isAlone(players) {
        if (players.size < 2) {
            return true;
        }
    }
    function frontUpdate(key) {
        if (state.collision === undefined && !state.outcome) {
            changeState(
                state,
                games.get(currentRoom).players.get(username),
                keyConfigs.get(key)
            );
        }
        if (state.outcome) {
            io.in(currentRoom).emit("outcome", state.outcome);
            socket.removeAllListeners("keypress");
        }

        io.in(currentRoom).emit("coords", state.coords);
        io.in(currentRoom).emit("occupied", state.occupied);
        if (state.collision) {
            if (!state.outcome) {
                const winnerMap = new Map(state.players);
                winnerMap.delete(username);
                const winner = winnerMap.keys().next().value;
                const outcome = `${winner} is the winner!`;
                state.outcome = outcome;
                gameHistory.push({
                    date: new Date(),
                    players: Array.from(state.players.keys()),
                    outcome: outcome
                });
            }
            // io.in(currentRoom).clients((error, clients) => {
            //     if (error) throw error;
            //     clients.map(function (client) {

            //     })
            // });
            io.in(currentRoom).emit("outcome", state.outcome);
            socket.removeAllListeners("keypress");
        }
    }
    frontUpdate(key);
};
