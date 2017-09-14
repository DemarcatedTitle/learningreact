/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
const { List, fromJS } = require("immutable");
const moveSquare = require("./stateChanges.js").moveSquare;
let io;
const JWT = require("jsonwebtoken");
function chatMessageEmission(room, chatlogs) {
    return JSON.stringify({
        room: room,
        logs: chatlogs.get(room)
    });
}
exports.io = function(listener, secret, users) {
    io = require("socket.io")(listener);

    io.use(function(socket, next) {
        const receivedToken = socket.handshake.query.token;
        JWT.verify(receivedToken, secret, function(err) {
            if (err) {
                console.log("io.use \n" + err);
                return next(
                    new Error(
                        "Sorry, something went wrong. Please try logging in."
                    )
                );
            } else {
                return next();
            }
        });
    });
    let chatters = new Map();
    var chatlogs = new Map();
    let rooms = new Map();
    let games = new Map();
    function gameInit() {
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
        const playerOneStart = [
            parseInt(grid.length / 2, 10),
            parseInt(grid[1].length / 2, 10)
        ];
        const playerTwoStart = [
            parseInt(grid.length / 2, 10),
            parseInt(grid[1].length / 2, 10)
        ];
        const startingPoints = fromJS([[playerOneStart], [playerTwoStart]]);
        const gridHeight = grid.length;
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }
        let occupied = [];
        for (let i = 0; i < 25; i += 1) {
            occupied.push([
                getRandomInt(0, gridHeight),
                getRandomInt(0, gridHeight)
            ]);
        }
        return {
            coords: startingPoints,
            occupied: fromJS(occupied),
            grid: grid
        };
    }
    // moveSquare(state, 0, direction);
    io.on("connection", function(socket) {
        let currentRoom = "";
        let userToken = socket.handshake.query.token;
        io.to(socket.id).emit(
            "rooms",
            JSON.stringify({
                rooms: Array.from(rooms.keys()),
                currentRoom: currentRoom
            })
        );
        JWT.verify(userToken, secret, function(err, decoded) {
            chatters.set(socket.id, decoded.username);
            io.in(currentRoom).clients((error, clients) => {
                if (error) throw error;
                io.to(socket.id).emit(
                    "users",
                    JSON.stringify({
                        users: clients.map(client => chatters.get(client)),
                        currentUser: decoded.username
                    })
                );
            });
        });
        console.log(socket.listeners);
        socket.on("disconnecting", function(reason) {
            console.log(reason);
            const roomsLeaving = Object.keys(socket.rooms);
            roomsLeaving.forEach(function(room) {
                console.log(room);
                console.log(`${chatters.get(socket.id)} just left`);
                socket.to(room).emit("userLeft", chatters.get(socket.id));
            });
            chatters.delete(socket.id);
        });
        socket.on("new room", function(room) {
            currentRoom = room;
            JWT.verify(userToken, secret, function(err, decoded) {
                if (err) {
                    io.emit("error", "Something went wrong");
                } else if (decoded.username) {
                    rooms.set(room, io.of(room));
                    chatlogs.set(currentRoom, []);
                    let grid = [];
                    const state = gameInit();
                    state.players = new Map([[decoded.username, 0]]);
                    console.log(state.players);
                    games.set(currentRoom, state);
                    socket.join(room, () => {
                        socket.broadcast.emit(
                            "rooms",
                            JSON.stringify({
                                rooms: Array.from(rooms.keys())
                            })
                        );
                        io.in(currentRoom).clients((error, clients) => {
                            if (error) throw error;
                            io.to(socket.id).emit(
                                "users",
                                JSON.stringify({
                                    users: clients.map(client =>
                                        chatters.get(client)
                                    ),
                                    currentUser: decoded.username
                                })
                            );
                        });

                        io.to(socket.id).emit(
                            "rooms",
                            JSON.stringify({
                                rooms: Array.from(rooms.keys()),
                                currentRoom: room
                            })
                        );
                    });
                    // Initialize here
                    // I'll probably have to do this like chat rooms
                    // each namespace gets an object
                    // and when someone makes a new chat or joins, they get
                    // the appropriate data
                    io.to(socket.id).emit("grid", state.grid);
                    io.to(socket.id).emit("coords", state.coords);
                    io.to(socket.id).emit("occupied", state.occupied);
                    console.log(state.coords);
                    socket.on("keypress", function(key) {
                        // Some kind of tick might make it feel less janky
                        // if (key === "ArrowUp") {
                        //     changeState(state, 0, up);
                        //     // moveSquare(state, 0,0, "up");
                        //     io.to(socket.id).emit("coords", state.coords);
                        //     io.to(socket.id).emit("occupied", state.occupied);
                        // }
                        if (key === "w") {
                            console.log(
                                games
                                    .get(currentRoom)
                                    .players.get(decoded.username)
                            );
                            changeState(
                                state,
                                games
                                    .get(currentRoom)
                                    .players.get(decoded.username),
                                "up"
                            );
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
                    });
                }
            });
        });
        function changeState(state, player, direction) {
            let tempState = moveSquare(state, player, direction);
            if (tempState.coords) {
                state.coords = tempState.coords;
            }
            if (tempState.occupied) {
                state.occupied = tempState.occupied;
            }
        }
        JWT.verify(userToken, secret, function(err, decoded) {
            if (err) {
                socket.emit("error", "Something went wrong");
            } else {
                socket.on("chat message", function(message) {
                    if (chatlogs.get(currentRoom)) {
                        console.log(`${chatters.get(socket.id)} just spoke`);
                        io.in(currentRoom).clients((error, clients) => {
                            if (error) throw error;
                            console.log(
                                `The following just heard:
                        ${clients.map(function(id) {
                                    return chatters.get(id);
                                })}
                        `
                            );
                        });
                        console.log(`room is ${currentRoom}`);
                        chatlogs.get(currentRoom).push({
                            date: new Date(),
                            message: message,
                            username: decoded.username
                        });
                        io
                            .in(currentRoom)
                            .emit(
                                "chat message",
                                chatMessageEmission(currentRoom, chatlogs)
                            );
                        console.log(chatlogs.get(currentRoom));
                    }
                });
            }
        });
        socket.on("join", function(room) {
            currentRoom = room;
            JWT.verify(userToken, secret, function(err, decoded) {
                if (err) {
                    io.to(socket.id).emit("error", "Something went wrong");
                } else if (decoded.username) {
                    io.in(currentRoom).clients(function(error, clients) {
                        if (!clients.includes(users)) {
                            socket
                                .to(room)
                                .emit("userJoined", chatters.get(socket.id));
                        }
                    });
                    socket.join(room, () => {
                        if (
                            games.get(room).players.get(decoded.username) !== 0
                        ) {
                            games.get(room).players.set(decoded.username, 1);
                        }
                        io.to(socket.id).emit(
                            "rooms",
                            JSON.stringify({
                                rooms: Array.from(rooms.keys()),
                                currentRoom: room
                            })
                        );
                        io.in(currentRoom).clients((error, clients) => {
                            if (error) throw error;
                            io.to(socket.id).emit(
                                "users",
                                JSON.stringify({
                                    users: clients.map(client =>
                                        chatters.get(client)
                                    ),
                                    currentUser: decoded.username
                                })
                            );
                        });
                        io.to(socket.id).emit(
                            "chat message",
                            JSON.stringify({
                                room: room,
                                logs: chatlogs.get(room)
                            })
                        );
                    });
                    // Also start a game
                    console.log("test");
                    let state = games.get(currentRoom);
                    io.to(socket.id).emit("grid", state.grid);
                    io.to(socket.id).emit("coords", state.coords);
                    io.to(socket.id).emit("occupied", state.occupied);
                    console.log(socket.listeners("keypress"));
                    if (
                        games.get(room).players.get(decoded.username) ===
                        undefined
                    ) {
                        socket.on("keypress", function(key) {
                            // Some kind of tick might make it feel less janky
                            if (key === "ArrowUp") {
                                changeState(state, 1, up);
                                // moveSquare(state, 1,0, "up");
                                io.to(socket.id).emit("coords", state.coords);
                                io
                                    .to(socket.id)
                                    .emit("occupied", state.occupied);
                            }
                            if (key === "w") {
                                changeState(
                                    state,
                                    games
                                        .get(room)
                                        .players.get(decoded.username),
                                    "up"
                                );
                                io.to(socket.id).emit("coords", state.coords);
                                io
                                    .to(socket.id)
                                    .emit("occupied", state.occupied);
                            }
                            if (key === "s") {
                                changeState(
                                    state,
                                    games
                                        .get(room)
                                        .players.get(decoded.username),
                                    "down"
                                );
                                io.to(socket.id).emit("coords", state.coords);
                                io
                                    .to(socket.id)
                                    .emit("occupied", state.occupied);
                            }
                            if (key === "a") {
                                changeState(
                                    state,
                                    games
                                        .get(room)
                                        .players.get(decoded.username),
                                    "left"
                                );
                                io.to(socket.id).emit("coords", state.coords);
                                io
                                    .to(socket.id)
                                    .emit("occupied", state.occupied);
                            }
                            if (key === "d") {
                                changeState(
                                    state,
                                    games
                                        .get(room)
                                        .players.get(decoded.username),
                                    "right"
                                );
                                io.to(socket.id).emit("coords", state.coords);
                                io
                                    .to(socket.id)
                                    .emit("occupied", state.occupied);
                            }
                        });
                    }
                }
            });
        });
    });
};
