module.exports = function takeSteps(currentSpot, nextSpot, path, callback) {
    return new Promise(function(resolve) {
        if (path.length > 0) {
            const stepDiff = {
                x: nextSpot.x - currentSpot.x,
                y: nextSpot.y - currentSpot.y
            };
            let letter;
            if (stepDiff.x === -1) {
                letter = "w";
            } else if (stepDiff.x === 1) {
                letter = "s";
            } else if (stepDiff.y === 1) {
                letter = "d";
            } else if (stepDiff.y === -1) {
                letter = "a";
            }
            console.log(`takeSteps letter: ${letter}`);
            setTimeout(
                function(path, letter, callback) {
                    console.log(letter);
                    callback(letter).then(data => {
                        takeSteps(
                            path[0],
                            path[1],
                            path.slice(1),
                            callback
                        ).then(resolve(data));
                    });
                },
                350,
                path,
                letter.slice(),
                callback
            );
        } else {
            resolve("Ready for the next target");
        }
    });
};
