const returnDistance = require("./utilities").returnDistance;
const stepsToTake = require("./utilities").stepsToTake;
const closestSquare = require("./grid/utilities/closestSquare.js");
const directWalking = require("./directWalking.js");
const walkingPathfinder = require("./walkingPathfinder.js");
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
                    function greedyBot(intDifficulty) {
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
                        let state = games.get(socket.id);
                        console.log(state.occupied.get(0));
                        console.log(state.coords.getIn([0, 0]));
                        console.log(
                            stepsToTake(
                                state.coords.getIn([0, 0]),
                                state.occupied.get(0)
                            )
                        );
                        const context = {
                            room: socket.id,
                            username: "greedyBot",
                            io,
                            socket
                        };
                        // I need to refactor this to use walkingPathfinder
                        // So that steps are recalculated as neccessary
                        // Maybe it'll be something like,
                        // find path then step, step, step ...
                        // until at target path
                        //
                        //
                        // Alternatively I can convert the path into an array of
                        // direction:steps values and iterate through that with rec walkaxis

                        function continuousWalk(coord, occupied, ms, callback) {
                            if (occupied.size > 0) {
                                const closest = closestSquare(
                                    state.coords.getIn([1, 0]),
                                    state.occupied
                                );
                                // Get steps to closest square
                                console.log(
                                    `last in closest: ${JSON.stringify(
                                        closest.get(-1)
                                    )}`
                                );
                                walkingPathfinder(
                                    state,
                                    1,
                                    state.coords.getIn([1, 0]).toJS(),
                                    closest.get(-1).toJS()
                                ).then(function(val) {
                                    // console.log(val);
                                    console.log("\n\n\n");
                                    console.log(val);
                                    function iterateSteps(
                                        currentSpot,
                                        nextSpot,
                                        path,
                                        callback
                                    ) {
                                        if (path.length > 0) {
                                            // console.log(
                                            //     `currentSpot: ${JSON.stringify(
                                            //         currentSpot
                                            //     )}`
                                            // );
                                            // console.log(
                                            //     `nextSpot: ${JSON.stringify(
                                            //         nextSpot
                                            //     )}`
                                            // );
                                            const stepDiff = {
                                                x: nextSpot.x - currentSpot.x,
                                                y: nextSpot.y - currentSpot.y
                                            };
                                            let letter;
                                            if (stepDiff.x === -1) {
                                                letter = "w";
                                            } else if (stepDiff.x === 1) {
                                                letter = "s";
                                            } else if (stepDiff.y === 1) {
                                                letter = "d";
                                            } else if (stepDiff.y === -1) {
                                                letter = "a";
                                            }
                                            console.log(letter);
                                            setTimeout(
                                                function() {
                                                    keypress.bind(context)(
                                                        letter
                                                    );
                                                    iterateSteps(
                                                        path[0],
                                                        path[1],
                                                        path.slice(1)
                                                    );
                                                },
                                                100,
                                                path
                                            );

                                            // keypress.bind(context)(letter);
                                            // iterateSteps(
                                            //     path[0],
                                            //     path[1],
                                            //     path.slice(1, -1)
                                            // );
                                        }
                                    }
                                    iterateSteps(val[0], val[1], val.slice(1));

                                    // Create an array of steps
                                    // if one value changes,
                                    // track how long the other value stays the same
                                    // new coord is the last value where it stays the same
                                    // function findDirection(start, end) {
                                    //     if (start.x === end.x) {
                                    //         return "y";
                                    //     } else if (start.y === end.y) {
                                    //         return "x";
                                    //     }
                                    // }
                                    // try {
                                    //     const steppingStones = val.reduce(
                                    //         function(
                                    //             accumulator,
                                    //             currentVal,
                                    //             currentIndex,
                                    //             array
                                    //         ) {
                                    //             if (currentIndex === 0) {
                                    //                 return accumulator;
                                    //             }
                                    //             if (
                                    //                 currentVal.x ===
                                    //                 array[currentIndex - 1].x
                                    //             ) {
                                    //                 const newY =
                                    //                     array[currentIndex - 1]
                                    //                         .y - currentVal.y;
                                    //                 if (
                                    //                     currentIndex > 0 &&
                                    //                     accumulator[
                                    //                         accumulator.length -
                                    //                             1
                                    //                     ].axis === "y"
                                    //                 ) {
                                    //                     return accumulator
                                    //                         .slice(0, -1)
                                    //                         .concat({
                                    //                             val: newY,
                                    //                             axis: "y"
                                    //                         });
                                    //                 } else {
                                    //                     return accumulator.concat(
                                    //                         {
                                    //                             axis: "y",
                                    //                             val:
                                    //                                 accumulator[
                                    //                                     accumulator.length -
                                    //                                         1
                                    //                                 ].val + newY
                                    //                         }
                                    //                     );
                                    //                 }
                                    //             } else if (
                                    //                 currentVal.y ===
                                    //                 array[currentIndex - 1].y
                                    //             ) {
                                    //                 const newX =
                                    //                     array[currentIndex - 1]
                                    //                         .x - currentVal.x;

                                    //                 if (
                                    //                     currentIndex > 0 &&
                                    //                     accumulator[
                                    //                         accumulator.length -
                                    //                             1
                                    //                     ].axis === "x"
                                    //                 ) {
                                    //                     return accumulator
                                    //                         .slice(0, -1)
                                    //                         .concat({
                                    //                             val:
                                    //                                 accumulator[
                                    //                                     accumulator.length -
                                    //                                         1
                                    //                                 ].val +
                                    //                                 newX,
                                    //                             axis: "y"
                                    //                         });
                                    //                 } else {
                                    //                     return accumulator.concat(
                                    //                         {
                                    //                             axis: "x",
                                    //                             val: newX
                                    //                         }
                                    //                     );
                                    //                 }
                                    //             }
                                    //         },
                                    //         [{ axis: "", val: 0 }]
                                    //     );
                                    //     console.log(steppingStones);
                                    // } catch (err) {
                                    // console.log(err);
                                    // }
                                    // returns [
                                    // {y: 1},
                                    // {x: -1},
                                    // {y: 1},
                                    // ...
                                    // ]
                                    // Get that array of objects and reduce it further
                                    // something like
                                    // [
                                    // {y: 1},
                                    // {x: -3},
                                    // {y: 2},
                                    // {x: -4}
                                    // ]
                                    //
                                    // And then iterate over that, call keypress n times
                                    // with the key being picked by letter/number combination
                                    // console.log(
                                    //     steppingStones.reduce(function(
                                    //         accumulator,
                                    //         currentVal,
                                    //         currentIndex,
                                    //         array
                                    //     ) {})
                                    // );
                                });
                                // directWalking(coord, occupied, ms, callback)
                                //     .then(data => {
                                //         return continuousWalk(
                                //             data.coords.getIn([1, 0]),
                                //             data.occupied,
                                //             ms,
                                //             callback
                                //         );
                                //     })
                                //     .catch(reason => console.log(reason));
                            } else {
                                console.log("Ran out of squares to grab!");
                            }
                        }
                        continuousWalk(
                            state.coords.getIn([1, 0]),
                            state.occupied,
                            900,
                            keypress.bind(context)
                        );
                    }
                    greedyBot(2000);
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
