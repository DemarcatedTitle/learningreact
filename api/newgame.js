exports.newgame = function(room) {
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
        keypress
    } = this;
    const currentRoom = room;
    JWT.verify(userToken, secret, function(err, decoded) {
        if (err) {
            io.emit("error", "Something went wrong");
        } else if (decoded.username) {
            // Recursively find a number to append to room name to allow people to have an arbitrary number of rooms
            function roomN(room, rooms, digit) {
                if (rooms.has(`${room}-${digit}`) === true) {
                    return roomN(room, rooms, digit + 1);
                } else {
                    return `${room}-${digit}`;
                }
            }
            let i = 2;
            if (rooms.has(room) === false) {
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
                    gameUpdates(socket, state, decoded.username, room);
                    activePlayers.set(decoded.username, currentRoom);
                });
                let context = {
                    room,
                    username: decoded.username,
                    io,
                    socket
                };
                socket.removeAllListeners("keypress");
                socket.on("keypress", keypress.bind(context));
            } else {
                let numberedRoom = roomN(room, rooms, i);
                forfeitPrevious(decoded.username, socket, numberedRoom);
                rooms.set(numberedRoom, io.of(numberedRoom));
                chatlogs.set(numberedRoom, []);
                let grid = [];
                const state = gameInit();
                state.players = new Map([[decoded.username, 0]]);
                games.set(numberedRoom, state);
                socket.join(numberedRoom, () => {
                    socket.broadcast.emit(
                        "rooms",
                        JSON.stringify({
                            rooms: Array.from(rooms.keys())
                        })
                    );
                    io.in(numberedRoom).clients((error, clients) => {
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
                            currentRoom: numberedRoom
                        })
                    );
                    gameUpdates(socket, state, decoded.username, numberedRoom);
                    activePlayers.set(decoded.username, numberedRoom);
                });
                let context = {
                    room: numberedRoom,
                    username: decoded.username,
                    io,
                    socket
                };
                socket.removeAllListeners("keypress");
                socket.on("keypress", keypress.bind(context));
            }
        }
    });
};
