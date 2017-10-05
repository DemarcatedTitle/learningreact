/* eslint-disable no-console */
/* eslint-disable indent */
const { List, fromJS } = require("immutable");
const keypress = require("./keypress.js").keypress;
const gameInit = require("./gameInit.js").gameInit;
const moveSquare = require("./grid/stateChanges.js").moveSquare;
const {
    chatters,
    chatlogs,
    rooms,
    games,
    activePlayers,
    gameHistory
} = require("./gamestate.js");
let io;
const JWT = require("jsonwebtoken");
function chatMessageEmission(room, chatlogs) {
    return JSON.stringify({
        room: room,
        logs: chatlogs.get(room)
    });
}
function forfeitPrevious(username, socket, currentRoom) {
    if (activePlayers.has(username)) {
        let previousRoom = activePlayers.get(username);
        let outcome;
        if (!games.get(previousRoom).outcome) {
            const prevPlayers = games.get(previousRoom).players;
            const winnerMap = new Map(prevPlayers);
            winnerMap.delete(username);
            const winner = winnerMap.keys().next().value;
            outcome = `${username} has forfeited, ${winner} is the winner!`;
            gameHistory.push({
                date: new Date(),
                players: Array.from(prevPlayers.keys()),
                outcome: outcome
            });
            games.get(previousRoom).outcome = outcome;
        } else {
            outcome = games.get(previousRoom).outcome;
        }
        io.in(previousRoom).emit("outcome", outcome);
        socket.leave(previousRoom, function(socket) {});
        io.in(previousRoom).clients((error, clients) => {
            if (error) throw error;
            if (clients.length === 0) {
                rooms.delete(previousRoom);
                io.emit(
                    "rooms",
                    JSON.stringify({
                        rooms: Array.from(rooms.keys())
                    })
                );
            }
        });
    }
}

function updateRoomLists() {
    // Iterate over each room
    io.in(currentRoom).emit(
        "rooms",
        JSON.stringify({
            rooms: Array.from(rooms.keys())
            // currentRoom: currentRoom
        })
    );
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
    io.on("connection", function(socket, username) {
        function gameUpdates(socket, state, username) {
            io.in(currentRoom).emit("grid", state.grid);
            io.in(currentRoom).emit("coords", state.coords);
            io.in(currentRoom).emit("occupied", state.occupied);
            if (games.get(currentRoom).players.size === 1) {
                io.in(currentRoom).emit("outcome", "Waiting");
            } else {
                io.in(currentRoom).emit("outcome", "Game In Progress");
            }
            // The line below returns the "you" player number
            io
                .to(socket.id)
                .emit("you", games.get(currentRoom).players.get(username));
        }
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
        socket.on("disconnecting", function(reason) {
            console.log(reason);
            const roomsLeaving = Object.keys(socket.rooms);
            roomsLeaving.forEach(function(room) {
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
                    forfeitPrevious(decoded.username, socket, currentRoom);
                    rooms.set(room, io.of(room));
                    chatlogs.set(currentRoom, []);
                    let grid = [];
                    const state = gameInit();
                    state.players = new Map([[decoded.username, 0]]);
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
                        gameUpdates(socket, state, decoded.username);
                        activePlayers.set(decoded.username, currentRoom);
                    });
                    let context = {
                        currentRoom,
                        username: decoded.username,
                        io,
                        socket
                    };
                    socket.removeAllListeners("keypress");
                    socket.on("keypress", keypress.bind(context));
                }
            });
        });
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
                    forfeitPrevious(decoded.username, socket, currentRoom);
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
                            let tempState = gameInit();
                            games.get(room).players.set(decoded.username, 1);
                            tempState.players = games.get(room).players;
                            games.set(currentRoom, tempState);
                        } else {
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
                        // const state = gameInit();
                        // state.players = new Map([[decoded.username, 0]]);
                        // games.set(currentRoom, state);

                        let state = games.get(currentRoom);
                        gameUpdates(socket, state, decoded.username);
                        activePlayers.set(decoded.username, currentRoom);
                    });
                    let context = {
                        currentRoom,
                        username: decoded.username,
                        io,
                        socket
                    };
                    if (
                        typeof games.get(room).players.get(decoded.username) ===
                        "number"
                    ) {
                        socket.removeAllListeners("keypress");
                        socket.on("keypress", keypress.bind(context));
                    } else if (
                        // If there is an available slot and you aren't in the game
                        games.get(room).players.get(decoded.username) ===
                            undefined &&
                        games.get(room).players.size < 2
                    ) {
                        socket.removeAllListeners("keypress");
                        socket.on("keypress", keypress.bind(context));
                    } else if (
                        games.get(room).players.get(decoded.username) ===
                            undefined &&
                        games.get(room).players.size < 2
                    ) {
                        // socket.removeAllListeners("keypress");
                        socket.on("keypress", keypress.bind(context));
                    }
                }
            });
        });
        socket.on("gameHistory", function(request) {
            console.log("gameHistory requested");
            console.log(gameHistory);
            io.to(socket.id).emit("gameHistory", gameHistory);
        });
    });
    const repl = require("repl");
    repl.start("> ").context.io = io;
};
