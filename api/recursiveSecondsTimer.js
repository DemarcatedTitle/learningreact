function timerEmit(seconds) {
    io.to(currentRoom).emit("outcome", `${seconds}`);
}
function recursiveSecondsTimer(cb, seconds) {
    let state = games.get(currentRoom);
    if (seconds > 0 && state.outcome === undefined) {
        console.log(seconds);
        cb(seconds);
        return setTimeout(recursiveSecondsTimer, 1000, cb, seconds - 1);
    } else if (state.outcome === undefined) {
        function winning(coords, players) {
            if (coords.get(0).size === coords.get(1).size) {
                return "draw";
            } else if (coords.get(0).size > coords.get(1).size) {
                return 0;
            } else {
                return 1;
            }
        }
        function whichPlayer(number, players) {
            const playerArr = Array.from(players);
            playerArr.map(function(currentValue, index, array) {
                if (currentValue[1] === number) {
                    const winner = currentValue[0];
                    const outcome = `${winner} is the winner`;
                    const playersHistory = Array.from(players.keys());
                    // mutates
                    state.outcome = outcome;
                    // mutates
                    gameHistory.push({
                        date: new Date(),
                        players: playersHistory,
                        outcome: outcome
                    });
                }
            });
        }
        whichPlayer(winning(state.coords, state.players), state.players);
        io.to(currentRoom).emit("outcome", "Time's up!");
        function delayedOutcome() {
            io.to(currentRoom).emit("outcome", state.outcome);
        }
        setTimeout(delayedOutcome, 1000);
    }
}
