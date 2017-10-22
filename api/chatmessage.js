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
        keypress
    } = this;
    JWT.verify(userToken, secret, function(err, decoded) {
        if (err) {
            socket.emit("error", "Something went wrong");
        } else {
            const currentRoom = getCurrentRoom(
                socket.id,
                activePlayers,
                chatters
            );
            function chatCommands(command) {
                let reply;
                const rooms = ["Tutorial"];
                if (command === "/tutorial") {
                    console.log(rooms);
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

                    reply = JSON.stringify({
                        room: "tutorial",
                        logs: [
                            {
                                date: new Date(),
                                message: "You just asked for a tutorial",
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
        }
    });
};
