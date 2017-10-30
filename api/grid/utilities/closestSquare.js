const returnDistance = require("../../utilities.js").returnDistance;
module.exports = function closestSquare(currentLocation, listToSort) {
    return listToSort.sort(function(a, b) {
        if (
            returnDistance(currentLocation, a) >
            returnDistance(currentLocation, b)
        ) {
            return 1;
        }
        if (
            returnDistance(currentLocation, a) <
            returnDistance(currentLocation, b)
        ) {
            return -1;
        }
        return 0;
    });
};
