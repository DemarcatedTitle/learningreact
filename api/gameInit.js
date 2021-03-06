const { List, fromJS } = require("immutable");
exports.gameInit = function gameInit() {
    function gridInit(x, y) {
        for (let i = 0; i < x; i++) {
            let yArray = [];
            for (let j = 0; j < y; j++) {
                yArray.push([i, j]);
            }
            grid.push(yArray);
        }
    }
    let grid = [];
    gridInit(14, 14);
    const playerOneStart = [
        parseInt(grid.length / 2, 10),
        parseInt(grid[1].length / 2, 10)
    ];
    const playerTwoStart = [
        parseInt(grid.length / 2, 10),
        parseInt(grid[1].length / 2, 10)
    ];
    const startingPoints = fromJS([[playerOneStart], [playerTwoStart]]);
    const gridHeight = grid.length;
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    let occupied = [];
    for (let i = 0; i < 25; i += 1) {
        let currentSpot = [
            getRandomInt(0, gridHeight),
            getRandomInt(0, gridHeight)
        ];
        occupied.push(currentSpot);
    }
    const immOccupied = fromJS(occupied);
    let newimmOcc = immOccupied
        .filter(function(value) {
            return (
                immOccupied.indexOf(value) === immOccupied.lastIndexOf(value)
            );
        })
        .filter(function(value, index, iter) {
            // This should leave me with an Occupied List that doesn't contain the starting point
            return value !== List([7, 7]);
        });
    return {
        coords: startingPoints,
        occupied: newimmOcc,
        grid: grid
    };
};
