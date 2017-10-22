/* eslint-disable no-console */
/* eslint-disable indent */
const { List, fromJS } = require("immutable");
const keypress = require("./keypress.js").keypress;
const gameInit = require("./gameInit.js").gameInit;
const moveSquare = require("./grid/stateChanges.js").moveSquare;
const join = require("./join").join;
const newgame = require("./newgame").newgame;
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
            if (players.length > 1) {
                gameHistory.push({
                    date: new Date(),
                    players: players,
                    outcome: outcome
                });
            }
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
            }
            if (reason === "tutorial") {
                socket.broadcast.emit(
                    "rooms",
                    JSON.stringify({
                        rooms: Array.from(rooms.keys())
                    })
                );
            } else {
                if (clients.length === 0) {
                    io.emit(
                        "rooms",
                        JSON.stringify({
                            rooms: Array.from(rooms.keys())
                        })
                    );
                }
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
        function gameUpdates(socket, state, username, room) {
            io.in(room).emit("grid", state.grid);
            io.in(room).emit("coords", state.coords);
            io.in(room).emit("occupied", state.occupied);
            if (games.get(room).players.size === 1) {
                io.in(room).emit("outcome", "Waiting");
            } else {
                io.in(room).emit("outcome", "Game In Progress");
            }
            // The line below returns the "you" player number
            io.to(socket.id).emit("you", games.get(room).players.get(username));
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
        const socketContext = {
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
            keypress: keypress
        };

        socket.on("disconnecting", function(reason) {
            console.log(reason);
            const roomsLeaving = Object.keys(socket.rooms);
            roomsLeaving.forEach(function(room) {
                console.log(`${chatters.get(socket.id)} just left`);
                socket.to(room).emit("userLeft", chatters.get(socket.id));
            });
            chatters.delete(socket.id);
        });
        socket.on("new room", newgame.bind(socketContext));
        // function(room) {
        //     currentRoom = room;
        //     JWT.verify(userToken, secret, function(err, decoded) {
        //         if (err) {
        //             io.emit("error", "Something went wrong");
        //         } else if (decoded.username) {
        //             // Recursively find a number to append to room name to allow people to have an arbitrary number of rooms
        //             function roomN(room, rooms, digit) {
        //                 if (rooms.has(`${room}-${digit}`) === true) {
        //                     return roomN(room, rooms, digit + 1);
        //                 } else {
        //                     return `${room}-${digit}`;
        //                 }
        //             }
        //             let i = 2;
        //             if (rooms.has(room) === false) {
        //                 forfeitPrevious(decoded.username, socket, currentRoom);
        //                 rooms.set(room, io.of(room));
        //                 chatlogs.set(currentRoom, []);
        //                 let grid = [];
        //                 const state = gameInit();
        //                 state.players = new Map([[decoded.username, 0]]);
        //                 games.set(currentRoom, state);
        //                 socket.join(room, () => {
        //                     socket.broadcast.emit(
        //                         "rooms",
        //                         JSON.stringify({
        //                             rooms: Array.from(rooms.keys())
        //                         })
        //                     );
        //                     io.in(currentRoom).clients((error, clients) => {
        //                         if (error) throw error;
        //                         io.to(socket.id).emit(
        //                             "users",
        //                             JSON.stringify({
        //                                 users: clients.map(client =>
        //                                     chatters.get(client)
        //                                 ),
        //                                 currentUser: decoded.username
        //                             })
        //                         );
        //                     });

        //                     io.to(socket.id).emit(
        //                         "rooms",
        //                         JSON.stringify({
        //                             rooms: Array.from(rooms.keys()),
        //                             currentRoom: room
        //                         })
        //                     );
        //                     gameUpdates(socket, state, decoded.username, room);
        //                     activePlayers.set(decoded.username, currentRoom);
        //                 });
        //                 let context = {
        //                     room,
        //                     username: decoded.username,
        //                     io,
        //                     socket
        //                 };
        //                 socket.removeAllListeners("keypress");
        //                 socket.on("keypress", keypress.bind(context));
        //             } else {
        //                 let numberedRoom = roomN(room, rooms, i);
        //                 forfeitPrevious(decoded.username, socket, numberedRoom);
        //                 rooms.set(numberedRoom, io.of(numberedRoom));
        //                 chatlogs.set(numberedRoom, []);
        //                 let grid = [];
        //                 const state = gameInit();
        //                 state.players = new Map([[decoded.username, 0]]);
        //                 games.set(numberedRoom, state);
        //                 socket.join(numberedRoom, () => {
        //                     socket.broadcast.emit(
        //                         "rooms",
        //                         JSON.stringify({
        //                             rooms: Array.from(rooms.keys())
        //                         })
        //                     );
        //                     io.in(numberedRoom).clients((error, clients) => {
        //                         if (error) throw error;
        //                         io.to(socket.id).emit(
        //                             "users",
        //                             JSON.stringify({
        //                                 users: clients.map(client =>
        //                                     chatters.get(client)
        //                                 ),
        //                                 currentUser: decoded.username
        //                             })
        //                         );
        //                     });

        //                     io.to(socket.id).emit(
        //                         "rooms",
        //                         JSON.stringify({
        //                             rooms: Array.from(rooms.keys()),
        //                             currentRoom: numberedRoom
        //                         })
        //                     );
        //                     gameUpdates(
        //                         socket,
        //                         state,
        //                         decoded.username,
        //                         numberedRoom
        //                     );
        //                     activePlayers.set(decoded.username, numberedRoom);
        //                 });
        //                 let context = {
        //                     room: numberedRoom,
        //                     username: decoded.username,
        //                     io,
        //                     socket
        //                 };
        //                 socket.removeAllListeners("keypress");
        //                 socket.on("keypress", keypress.bind(context));
        //             }
        //         }
        //     });
        // });
        JWT.verify(userToken, secret, function(err, decoded) {
            if (err) {
                socket.emit("error", "Something went wrong");
            } else {
                socket.on("chat message", function(message) {
                    function chatCommands(command) {
                        let reply;
                        const rooms = ["Tutorial"];
                        if (command === "/tutorial") {
                            console.log(rooms);
                            forfeitPrevious(
                                decoded.username,
                                socket,
                                getCurrentRoom(
                                    socket.id,
                                    activePlayers,
                                    chatters
                                ),
                                "tutorial"
                            );
                            io.to(socket.id).emit(
                                "rooms",
                                JSON.stringify({
                                    rooms: rooms,
                                    currentRoom: "Tutorial"
                                })
                            );

                            reply = JSON.stringify({
                                room: "tutorial",
                                logs: [
                                    {
                                        date: new Date(),
                                        message:
                                            "You just asked for a tutorial",
                                        username: "Server"
                                    }
                                ]
                            });
                            io.to(socket.id).emit("chat message", reply);
                        }
                        return reply;
                    }
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
                    chatCommands(message);
                });
            }
        });

        socket.on("join", join.bind(socketContext));
        socket.on("gameHistory", function(request) {
            console.log("gameHistory requested");
            console.log(gameHistory);
            io.to(socket.id).emit("gameHistory", gameHistory);
        });
        console.log("connection");
    });
    const repl = require("repl");
    repl.start("> ").context.io = io;
};
