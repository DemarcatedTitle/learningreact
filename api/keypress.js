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

    function frontUpdate(key) {
        changeState(
            state,
            games.get(currentRoom).players.get(username),
            keyConfigs.get(key)
        );
        io.in(currentRoom).emit("coords", state.coords);
        io.in(currentRoom).emit("occupied", state.occupied);
        if (state.collision) {
            const winnerMap = new Map(state.players);
            winnerMap.delete(username);
            const winner = winnerMap.keys().next().value;
            console.log(winner);
            io.in(currentRoom).emit("outcome", `${winner} is the winner!`);
        } else {
            io.to(socket.id).emit("outcome", "Game In Progress");
        }
    }
    frontUpdate(key);
    // if (key === "w") {
    //     changeState(state, games.get(currentRoom).players.get(username), "up");
    //     io.in(currentRoom).emit("coords", state.coords);
    //     io.in(currentRoom).emit("occupied", state.occupied);
    //     if (state.collision) {
    //         const winnerMap = new Map(state.players);
    //         winnerMap.delete(username);
    //         const winner = winnerMap.keys().next().value;
    //         console.log(winner);
    //         io.in(currentRoom).emit("outcome", `${winner} is the winner!`);
    //     } else {
    //         io.to(socket.id).emit("outcome", "Game In Progress");
    //     }
    // }
    // if (key === "s") {
    //     changeState(
    //         state,
    //         games.get(currentRoom).players.get(username),
    //         "down"
    //     );
    //     io.in(currentRoom).emit("coords", state.coords);
    //     io.in(currentRoom).emit("occupied", state.occupied);
    //     if (state.collision) {
    //         io.to(socket.id).emit("outcome", "Collision detected");
    //     } else {
    //         io.to(socket.id).emit("outcome", "Game In Progress");
    //     }
    // }
    // if (key === "a") {
    //     changeState(
    //         state,
    //         games.get(currentRoom).players.get(username),
    //         "left"
    //     );
    //     io.in(currentRoom).emit("coords", state.coords);
    //     io.in(currentRoom).emit("occupied", state.occupied);
    //     if (state.collision) {
    //         io.to(socket.id).emit("outcome", "Collision detected");
    //     } else {
    //         io.to(socket.id).emit("outcome", "Game In Progress");
    //     }
    // }
    // if (key === "d") {
    //     changeState(
    //         state,
    //         games.get(currentRoom).players.get(username),
    //         "right"
    //     );
    //     io.in(currentRoom).emit("coords", state.coords);
    //     io.in(currentRoom).emit("occupied", state.occupied);
    //     if (state.collision) {
    //         io.to(socket.id).emit("outcome", "Collision detected");
    //     } else {
    //         io.to(socket.id).emit("outcome", "Game In Progress");
    //     }
    // }
};
