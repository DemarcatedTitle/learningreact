var easystarjs = require("easystarjs");
var easystar = new easystarjs.js();
const { List, fromJS } = require("immutable");

// Pass gamestate into this module
// convert it into an easystarjs usable format
// caluclate Starting point -> closest occupied point
// Use the path to decide how bot travels
// This doesn't have to check with player just yet
//
module.exports = function walkingPathfinder(
    state,
    currentPlayer,
    startCoords,
    targetCoords
) {
    return new Promise(resolve => {
        // const grid = toJS(state.grid);
        // I need to filter twice because it is an array of arrays
        const grid = state.grid.map(function(item) {
            return item.map(function(coord) {
                return List(coord);
            });
        });
        const acceptableTiles = grid
            .reduce(function(sum, value) {
                return sum.concat(value);
            })
            .filter(function(coord) {
                // console.log(`state.coords.get(1): ${state.coords.get(1)}`);
                // console.log(`coord: ${coord}`);
                // console.log(state.coords.get(1).includes(coord));

                return !state.coords.get(1).includes(coord);
            });
        easystar.setGrid(grid);
        easystar.setAcceptableTiles(acceptableTiles);
        try {
            easystar.findPath(
                startCoords[0],
                startCoords[1],
                targetCoords[0],
                targetCoords[1],
                function(path) {
                    if (path === null) {
                        console.log("Path was not found.");
                    } else {
                        resolve(path);
                    }
                }
            );
        } catch (err) {
            console.log(err);
        }
        easystar.calculate();
    });
};
