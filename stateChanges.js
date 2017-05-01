/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-undef*/
//There *has* to be a faster way to do this that doesn't involve two maps, but this works
//And I will use it for now
const moveSquare = (state, player, direction) => {
    let newCoords = state.coords[player][0];
    const whichWay = {
        up: function() {
            return (newCoords[0] -= 1);
        },
        down: function() {
            return (newCoords[0] += 1);
        },
        left: function() {
            return (newCoords[1] -= 1);
        },
        right: function() {
            return (newCoords[1] += 1);
        }
    };
    whichWay[direction]();
    if (occupied.includes(newCoords.toString())) {
        console.log(`Chomp at ${newCoords}`);
    }
    return {
        coordCheck: coordCheckInit(state),
        noVar: newCoords
    };
};
const coordCheckInit = state => {
    let newLocationList = [];
    state.coords.map(function(currentPlayer) {
        currentPlayer.map(function(currentCoord) {
            newLocationList.push(currentCoord.toString());
        });
        //This will iterate through each player list
    });
    return newLocationList;
};
//I need something that will check if a player is over food
//And then adds another coord or trailing square to that player
// csquare does what bsquare did a turn ago
// bsquare does what asquare did a turn ago
// therefore square does what a square did two turns ago
//
//
