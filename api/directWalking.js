const stepsToTake = require("./utilities").stepsToTake;
const closestSquare = require("./grid/utilities/closestSquare.js");
const recWalkAxis = require("./grid/utilities/recWalkAxis.js");
// recWalkAxis: use callback function set amount of times
// function recWalkAxis(amount, ms, args, callback) {
//     if (amount > 0) {
//         setTimeout(
//             function(args) {
//                 callback(args);
//             },
//             ms,
//             args
//         );
//     }
// }
function whichKey(steps) {
    let keys = [];
    if (steps[1] < 0) {
        keys[1] = "d";
    } else {
        keys[1] = "a";
    }
    if (steps[0] > 0) {
        keys[0] = "w";
    } else {
        keys[0] = "s";
    }
    return keys;
}

// directWalking should run keypress with the appropriate argument
// to walk to the destination.
module.exports = function directWalking(startCoord, occupied, ms, cb) {
    return new Promise(resolve => {
        try {
            // grab closest square
            const closest = closestSquare(startCoord, occupied);
            // Get steps to closest square
            const steps = stepsToTake(startCoord, closest.get(0));
            const keys = whichKey(steps);
            return Promise.all([
                recWalkAxis(Math.abs(steps[0]), ms, keys[0], cb),
                recWalkAxis(Math.abs(steps[1]), ms, keys[1], cb)
            ]).then(directWalkingVal => {
                try {
                    const goodArr = directWalkingVal.filter(function(item) {
                        return item !== undefined;
                    });
                    resolve(goodArr[goodArr.length - 1]);
                } catch (e) {
                    console.log(e);
                }
            });
        } catch (e) {
            console.log(e);
        }
    });
};
