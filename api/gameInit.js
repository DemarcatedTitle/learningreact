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
        occupied.push([
            getRandomInt(0, gridHeight),
            getRandomInt(0, gridHeight)
        ]);
    }
    return {
        coords: startingPoints,
        occupied: fromJS(occupied),
        grid: grid
    };
};
