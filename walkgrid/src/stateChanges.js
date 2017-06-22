/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { List, fromJS } from "immutable";
const whichWay = {
    // Player is an integer, 0 or 1 right now
    // The second one sets the player square to where it is directed
    //
    up: function(player, listCoords) {
        const playerList = listCoords.get(player);
        // The variable declaration is because it currently seems easier to read
        if (playerList.size >= 2) {
            // This is allows for an arbitrary number of elements in the list to trail the lead square
            // unshift adds new coord to the list, but transformed so it is where you want it
            // .pop removes the last element in the list so it doesn't just get longer
            const ammendedPlayerList = playerList
                .unshift(playerList.updateIn([0, 0], val => val - 1).get(0))
                .pop();
            return listCoords.set(player, ammendedPlayerList);
        } else {
            return listCoords.updateIn([player, 0, 0], val => val - 1);
        }
    },
    down: function(player, listCoords) {
        const playerList = listCoords.get(player);
        if (playerList.size >= 2) {
            const ammendedPlayerList = playerList
                .unshift(playerList.updateIn([0, 0], val => val + 1).get(0))
                .pop();
            return listCoords.set(player, ammendedPlayerList);
        } else {
            return listCoords.updateIn([player, 0, 0], val => val + 1);
        }
    },
    left: function(player, listCoords) {
        const playerList = listCoords.get(player);
        if (playerList.size >= 2) {
            const ammendedPlayerList = playerList
                .unshift(playerList.updateIn([0, 1], val => val - 1).get(0))
                .pop();
            return listCoords.set(player, ammendedPlayerList);
        } else {
            return listCoords.updateIn([player, 0, 1], val => val - 1);
        }
    },
    right: function(player, listCoords) {
        const playerList = listCoords.get(player);
        if (playerList.size >= 2) {
            const ammendedPlayerList = playerList
                .unshift(playerList.updateIn([0, 1], val => val + 1).get(0))
                .pop();
            return listCoords.set(player, ammendedPlayerList);
        } else {
            return listCoords.updateIn([player, 0, 1], val => val + 1);
        }
    }
};
const moveSquare = (state, player, direction) => {
    const newCoords = state.coords.get(player).get(0);
    const trailing = state.coords.get(player).get(1);

    const listCoords = state.coords;
    // if (occupied.includes(newCoords.toString())) {
    //     console.log(`Chomp at ${newCoords}`);
    // }
    return {
        coordCheck: state.coords.flatten(1),
        coords: whichWay[direction](player, listCoords)
    };
};
export { moveSquare };
