/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
//There *has* to be a faster way to do this that doesn't involve two maps, but this works
//And I will use it for now
import { List, fromJS } from "immutable";
const coordCheckInit = coords => {
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
    let newCoords = state.coords.get(player).get(0);
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
    // if (occupied.includes(newCoords.toString())) {
    //     console.log(`Chomp at ${newCoords}`);
    // }
    return {
        // coordCheck: state.coords.flatten(1),
        coords: whichWay[direction]()
    };
};
//I need something that will check if a player is over food
//And then adds another coord or trailing square to that player
// csquare does what bsquare did a turn ago
// bsquare does what asquare did a turn ago
// therefore square does what a square did two turns ago
//
//
export { coordCheckInit, moveSquare };
