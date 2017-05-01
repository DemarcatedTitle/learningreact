/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-undef*/
const moveSquare = (state, player, direction) => {
    let newCoords = state[player];
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
    return {
        playerOne: newCoords
    };
};
