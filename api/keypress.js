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
        io.to(socket.id).emit("coords", state.coords);
        io.to(socket.id).emit("occupied", state.occupied);
    }
    if (key === "s") {
        changeState(state, 0, "down");
        io.to(socket.id).emit("coords", state.coords);
        io.to(socket.id).emit("occupied", state.occupied);
    }
    if (key === "a") {
        changeState(state, 0, "left");
        io.to(socket.id).emit("coords", state.coords);
        io.to(socket.id).emit("occupied", state.occupied);
    }
    if (key === "d") {
        changeState(state, 0, "right");
        io.to(socket.id).emit("coords", state.coords);
        io.to(socket.id).emit("occupied", state.occupied);
    }
};
