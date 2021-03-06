/* eslint-disable no-console */

// How everything is located
// state.coords[ lists of player lists, player list items(the squares), y/x(individual square coords)]
// so state.coords.getIn[0, 1,1]
// means: grab the first player's (0) list, grab the second item in the list(1), grab the x coord (1)
// Currently that is backward and I don't know how I got this far without realizing that.
// Normal coordinates are X(horizontal) ,Y(vertical)

const whichWay = {
    // Player is an integer, 0 or 1 right now
    // The second one sets the player square to where it is directed
    up: function(player, listCoords) {
        return listCoords
            .updateIn([player, 0, 0], val => val - 1)
            .getIn([player, 0]);
    },
    down: function(player, listCoords) {
        return listCoords
            .updateIn([player, 0, 0], val => val + 1)
            .getIn([player, 0]);
    },
    left: function(player, listCoords) {
        return listCoords
            .updateIn([player, 0, 1], val => val - 1)
            .getIn([player, 0]);
    },
    right: function(player, listCoords) {
        return listCoords
            .updateIn([player, 0, 1], val => val + 1)
            .getIn([player, 0]);
    }
};
function newState(
    newOccupied,
    newCoords,
    player,
    playerList,
    occupied,
    indexOfOccupied
) {
    if (newOccupied) {
        return {
            occupied: newOccupied,
            coords: newCoords.setIn(
                [player, playerList.size],
                occupied.get(indexOfOccupied)
            )
        };
    } else {
        return { coords: newCoords };
    }
}
function checkOverlap(occupied, indexOfOccupied) {
    if (indexOfOccupied === -1) {
        return false;
    } else {
        return occupied.delete(indexOfOccupied);
    }
}
const moveSquare = (state, player, direction) => {
    const occupied = state.occupied;
    const listCoords = state.coords;
    //
    const playerList = listCoords.get(player);
    const newLocation = whichWay[direction](player, listCoords, occupied);
    const indexOfOccupied = occupied.indexOf(newLocation);
    const newOccupied = checkOverlap(occupied, indexOfOccupied);
    if (playerList.size >= 2) {
        // This is allows for an arbitrary number of elements in the list to trail
        // the lead square
        // unshift adds new coord to the list, but transformed so it is where you want it
        // .pop removes the last element in the list so it doesn't just get longer
        const ammendedPlayerList = playerList.unshift(newLocation).pop();
        // conditional occupied delete, listcoords.set
        const newCoords = listCoords.set(player, ammendedPlayerList);
        return newState(
            newOccupied,
            newCoords,
            player,
            playerList,
            occupied,
            indexOfOccupied
        );
    } else {
        const newCoords = listCoords.setIn([player, 0], newLocation);
        return newState(
            newOccupied,
            newCoords,
            player,
            playerList,
            occupied,
            indexOfOccupied
        );
    }
};
export { moveSquare };
