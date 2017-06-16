/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
//There *has* to be a faster way to do this that doesn't involve two maps, but this works
//And I will use it for now
import { List, fromJS } from "immutable";
const coordCheckInit = coords => {
    // Immutable List push and map won't work exactly the same, as pushing a js array
    // I was getting an error about coords[0] is undefined
    // I will have to completely transform how things are done
    // So I'm not mutating stuff
    // Because it seems like a lot of what I've done so far is based on mutation
    // eslint-disable-next-line
    //let newLocationList = coords.map(function(currentPlayer) {
    //    currentPlayer.map(function(currentCoord) {
    //        //
    //        return currentCoord;
    //    });
    //    //This will iterate through each player list
    //});
    //// console.log(newLocationList.join(","));
    //return fromJS(newLocationList);
};
// Move square currently mutates state.coords
const moveSquare = (state, player, direction) => {
    const newCoords = state.coords.get(player).get(0);
    const listCoords = state.coords;
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
    // console.log(whichWay[direction]().join(","));
    return {
        coordCheck: state.coords.flatten(1),
        coords: whichWay[direction]()
        // coords: newCoords
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
