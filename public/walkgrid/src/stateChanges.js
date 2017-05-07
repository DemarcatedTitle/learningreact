/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
//There *has* to be a faster way to do this that doesn't involve two maps, but this works
//And I will use it for now
import { List, fromJS } from "immutable";
const nonPlayerCoordsInit = coords => {
    // eslint-disable-next-line
    let newLocationList = coords.map(function(currentPlayer) {
        currentPlayer.map(function(currentCoord) {
            //
            return currentCoord;
        });
    });
    return fromJS(newLocationList);
};
const moveSquare = (state, player, direction) => {
    let listCoords = state.coords;
    const whichWay = {
        up: function() {
            return listCoords.setIn(
                [player, 0, 0],
                listCoords.get(player).get(0).get(0) - 1
            );
        },
        down: function() {
            return listCoords.setIn(
                [player, 0, 0],
                listCoords.get(player).get(0).get(0) + 1
            );
        },
        left: function() {
            return listCoords.setIn(
                [player, 0, 1],
                listCoords.get(player).get(0).get(1) - 1
            );
        },
        right: function() {
            return listCoords.setIn(
                [player, 0, 1],
                listCoords.get(player).get(0).get(1) + 1
            );
        }
    };
    const newCoords = whichWay[direction]();
    if (state.occupied.includes(newCoords.getIn([player, 0]))) {
        console.log(`Chomp at ${newCoords.getIn([player, 0])}`);
    }
    return {
        // nonPlayerCoords: state.coords.flatten(1),
        coords: newCoords
    };
};
//I need something that will check if a player is over food
//And then adds another coord or trailing square to that player
// csquare does what bsquare did a turn ago
// bsquare does what asquare did a turn ago
// therefore square does what a square did two turns ago
//
//
export { nonPlayerCoordsInit, moveSquare };
