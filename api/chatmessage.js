exports.chatmessage = function(message) {
    const {
        chatMessageEmission,
        getCurrentRoom,
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
        appendMessage
    } = this;
    JWT.verify(userToken, secret, function(err, decoded) {
        if (err) {
            socket.emit("error", "Something went wrong");
        } else {
            // Send multiple messages with time in between each message
            // timedMessages mutates the log it is passed
            function timedMessages(room, messageArray, ms, logs) {
                messageArray.forEach(function(message, index, array) {
                    setTimeout(function() {
                        logs = appendMessage(
                            logs,
                            new Date(),
                            message,
                            "Server"
                        );
                        const reply = JSON.stringify({
                            room: room,
                            logs: logs
                        });
                        io.to(socket.id).emit("chat message", reply);
                    }, ms * (index + 1));
                });
            }
            const currentRoom = getCurrentRoom(
                socket.id,
                activePlayers,
                chatters
            );
            function chatCommands(command) {
                let reply;
                const rooms = ["Tutorial"];
                if (command === "/tutorial") {
                    let logs = [];
                    forfeitPrevious(
                        decoded.username,
                        socket,
                        getCurrentRoom(socket.id, activePlayers, chatters),
                        "tutorial"
                    );
                    io.to(socket.id).emit(
                        "rooms",
                        JSON.stringify({
                            rooms: rooms,
                            currentRoom: "Tutorial"
                        })
                    );
                    socket.join(socket.id, () => {});
                    socket.leave("/", () => {});
                    const state = gameInit();
                    games.set(socket.id, state);
                    state.players = new Map([[decoded.username, 0]]);
                    socket.removeAllListeners("keypress");

                    function tutorialgameUpdates(
                        socket,
                        state,
                        username,
                        room
                    ) {
                        io.in(room).emit("grid", state.grid);
                        io.in(room).emit("coords", state.coords);
                        io.in(room).emit("occupied", state.occupied);
                        if (games.get(room).players.size === 1) {
                            io.in(room).emit("outcome", "Waiting");
                        } else {
                            io.in(room).emit("outcome", "Game In Progress");
                        }
                        // The line below returns the "you" player number
                        io
                            .to(socket.id)
                            .emit("you", games.get(room).players.get(username));
                    }
                    tutorialgameUpdates(
                        socket,
                        state,
                        decoded.username,
                        socket.id
                    );
                    let context = {
                        room: socket.id,
                        username: decoded.username,
                        io,
                        socket
                    };
                    socket.on("keypress", keypress.bind(context));
                    timedMessages(
                        "Tutorial",
                        [
                            "Initializing tutorial...",
                            "This is a two player game.",
                            "Controls are currently WSAD to move.",
                            "Click the grid to target it and move instead of type.",
                            "In the pre-game lobby you can move however you want",
                            "Against other players however...",
                            "Colliding into either the squares you occupy or the squares they occupy results in a loss for you.",
                            "Should no one make that mistake, the player with the most squares wins the match"
                        ],
                        1500,
                        logs
                    );
                    function greedyBot() {
                        if (true) {
                            let tempState = gameInit();
                            games
                                .get(socket.id)
                                .players.set(decoded.username, 1);
                            tempState.players = new Map([
                                [decoded.username, 0],
                                ["greedyBot", 1]
                            ]);
                            games.set(socket.id, tempState);
                            gameUpdates(
                                socket,
                                tempState,
                                decoded.username,
                                socket.id
                            );
                        } else {
                        }
                        // io.to(socket.id).emit(
                        //     "rooms",
                        //     JSON.stringify({
                        //         rooms: Array.from(rooms.keys()),
                        //         currentRoom: room
                        //     })
                        // );
                        io.in(socket.id).clients((error, clients) => {
                            if (error) throw error;
                            io.to(socket.id).emit(
                                "users",
                                JSON.stringify({
                                    users: ["greedyBot", decoded.username],
                                    currentUser: decoded.username
                                })
                            );
                        });
                        // io.to(socket.id).emit(
                        //     "chat message",
                        //     JSON.stringify({
                        //         room: room,
                        //         logs: chatlogs.get(room)
                        //     })
                        // );
                        // const state = gameInit();
                        // state.players = new Map([[decoded.username, 0]]);
                        // games.set(currentRoom, state);

                        let state = games.get(socket.id);
                        // activePlayers.set(decoded.username, socket.id);
                    }
                    greedyBot();
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
        }
    });
};
