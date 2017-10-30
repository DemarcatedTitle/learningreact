exports.otherPlayer = function(player) {
    if (player === 1) {
        return 0;
    } else {
        return 1;
    }
};
exports.returnDistance = function returnDistance(
    currentLocation,
    occupiedLocation
) {
    return Math.sqrt(
        Math.pow(currentLocation.get(0) - occupiedLocation.get(0), 2) +
            Math.pow(currentLocation.get(1) - occupiedLocation.get(1), 2)
    );
};
exports.stepsToTake = function stepsToTake(currentLocation, occupiedLocation) {
    return [
        currentLocation.get(0) - occupiedLocation.get(0),
        currentLocation.get(1) - occupiedLocation.get(1)
    ];
};
