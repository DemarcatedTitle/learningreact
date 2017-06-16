// eslint-disable-next-line
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./main.css";
// eslint-disable-next-line
import { nonPlayerCoordsInit, moveSquare } from "./stateChanges.js";
// eslint-disable-next-line
import WalkGrid from "./walkGrid.js";
// eslint-disable-next-line
const { Map, List, fromJS } = require("immutable");
// eslint-disable-next-line
//Step 1: push all state to App
//Step 1.5: convert existing data into immutable data

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
let grid = [];
function gridInit(x, y) {
    for (let i = 0; i < x; i++) {
        let yArray = [];
        for (let j = 0; j < y; j++) {
            yArray.push([i, j]);
        }
        grid.push(yArray);
    }
}

gridInit(25, 25);
const gridHeight = grid.length;
let occupied = [];
for (let i = 0; i < gridHeight; i += 1) {
    occupied.push([getRandomInt(0, gridHeight), getRandomInt(0, gridHeight)]);
}

let outsideState;
const playerOneStart = [
    parseInt(grid.length / 2, 10),
    parseInt(grid[1].length / 2, 10)
];
const playerTwoStart = [
    parseInt(grid.length / 2, 10),
    parseInt(grid[1].length / 2, 10)
];
const startingPoints = fromJS([[playerOneStart, [14, 14]], [playerTwoStart]]);
let nonPlayerCoords = startingPoints.flatten(1);
outsideState = {
    coords: startingPoints,
    nonPlayerCoords: nonPlayerCoords,
    occupied: fromJS(occupied),
    animated: false
};

// I want this to just toggle each square as active just to see what it looks like.
//function loadingAnimation() {
//    for (let i = 0; i < gridHeight; i += 1) {
//    }
//    //This will let react know the animation when through
//    this.setState({ alreadyAnimated: true });
//}

let isKeydownAvailable = true;
// var myInt = setInterval(function () {
//     for
// });

grid = fromJS(grid);
class App extends Component {
    constructor(props) {
        super(props);
        this.state = outsideState;
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleKeyPress(event) {
        // Some kind of tick might make it less janky
        //
        if (isKeydownAvailable) {
            if (event.key === " ") {
                // eslint-disable-next-line
            }
            if (event.key === "ArrowUp") {
                this.setState(moveSquare(this.state, 0, "up"));
            }
            if (event.key === "ArrowDown") {
                this.setState(moveSquare(this.state, 0, "down"));
            }
            if (event.key === "ArrowLeft") {
                this.setState(moveSquare(this.state, 0, "left"));
            }
            if (event.key === "ArrowRight") {
                this.setState(moveSquare(this.state, 0, "right"));
            }
            if (event.key === "w") {
                this.setState(moveSquare(this.state, 1, "up"));
            }
            if (event.key === "s") {
                this.setState(moveSquare(this.state, 1, "down"));
            }
            if (event.key === "a") {
                this.setState(moveSquare(this.state, 1, "left"));
            }
            if (event.key === "d") {
                this.setState(moveSquare(this.state, 1, "right"));
            }
            isKeydownAvailable = false;
        }
        // Keeps movement from going crazy
        // Doesn't currently work well with two people doing this.
        // Could probably be solved by splitting it into n intervals for how many players.
        setInterval(function() {
            isKeydownAvailable = true;
        }, 5);
    }
    componentDidMount() {
        window.addEventListener("keypress", this.handleKeyPress);
    }
    componentWillUnmount() {
        window.removeEventListener("keypress", this.handleKeyPress);
    }
    // onChange(state) {
    //     this.setState(state);
    // }
    render() {
        return (
            <div className="App" tabIndex="0">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <WalkGrid
                    coords={this.state.coords}
                    occupied={this.state.occupied}
                    grid={grid}
                    nonPlayerCoords={this.state.nonPlayerCoords}
                    gridHeight={gridHeight}
                />
            </div>
        );
    }
}

export default App;
