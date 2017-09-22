const moveSquare = require("./grid/stateChanges.js").moveSquare;
const { chatters, chatlogs, rooms, games } = require("./gamestate.js");
function changeState(state, player, direction) {
    let tempState = moveSquare(state, player, direction);
    if (tempState.coords) {
        state.coords = tempState.coords;
    }
    if (tempState.occupied) {
        state.occupied = tempState.occupied;
    }
}
exports.keypress = function keypress(key) {
    let currentRoom = this.currentRoom;
    let username = this.username;
    let io = this.io;
    let socket = this.socket;
    let state = games.get(currentRoom);
    if (key === "w") {
        changeState(state, games.get(currentRoom).players.get(username), "up");
        io.in(currentRoom).emit("coords", state.coords);
        io.in(currentRoom).emit("occupied", state.occupied);
    }
    if (key === "s") {
        changeState(
            state,
            games.get(currentRoom).players.get(username),
            "down"
        );
        io.in(currentRoom).emit("coords", state.coords);
        io.in(currentRoom).emit("occupied", state.occupied);
    }
    if (key === "a") {
        changeState(
            state,
            games.get(currentRoom).players.get(username),
            "left"
        );
        io.in(currentRoom).emit("coords", state.coords);
        io.in(currentRoom).emit("occupied", state.occupied);
    }
    if (key === "d") {
        changeState(
            state,
            games.get(currentRoom).players.get(username),
            "right"
        );
        io.in(currentRoom).emit("coords", state.coords);
        io.in(currentRoom).emit("occupied", state.occupied);
    }
};
