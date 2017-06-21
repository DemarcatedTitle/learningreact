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
const whichWay = {
    // Player is an integer, 0 or 1 right now
    // The first .setIn sets the trailing square to where the player square is
    // The second one sets the player square to where it is directed
    // Success.
    // I need a more general algorithm that transforms the list.
    //
    up: function(player, listCoords) {
        const playerList = listCoords.get(player);
        console.log(playerList.join(","));
        console.log(playerList.get(0).size);
        if (playerList.size >= 2) {
            const ammendedPlayerList = playerList
                .unshift(playerList.updateIn([0, 0], val => val - 1).get(0))
                .pop();
            return listCoords.set(player, ammendedPlayerList);
        }
        // listCoords.set(player, ammendedPlayerList);
        // This is transforming the xy array into just a y array.
        // .setIn([player, 1], listCoords.get(player).get(0))
        // .setIn([player, 0, 0], listCoords.get(player).get(0).get(0) - 1);
    },
    down: function(player, listCoords) {
        const playerList = listCoords.get(player);
        console.log(playerList.join(","));
        return listCoords
            .setIn([player, 1], listCoords.get(player).get(0))
            .setIn([player, 0, 0], listCoords.get(player).get(0).get(0) + 1);
    },
    left: function(player, listCoords) {
        return listCoords
            .setIn([player, 1], listCoords.get(player).get(0))
            .setIn([player, 0, 1], listCoords.get(player).get(0).get(1) - 1);
    },
    right: function(player, listCoords) {
        return listCoords
            .setIn([player, 1], listCoords.get(player).get(0))
            .setIn([player, 0, 1], listCoords.get(player).get(0).get(1) + 1);
    }
};
const moveSquare = (state, player, direction) => {
    const newCoords = state.coords.get(player).get(0);
    const trailing = state.coords.get(player).get(1);

    const listCoords = state.coords;
    // if (occupied.includes(newCoords.toString())) {
    //     console.log(`Chomp at ${newCoords}`);
    // }
    // console.log(whichWay[direction]().join(","));
    return {
        coordCheck: state.coords.flatten(1),
        coords: whichWay[direction](player, listCoords)
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
