/* eslint-disable no-unused-vars */
// eslint-disable-next-line
import React, { Component } from "react";
import "./App.css";
import "./main.css";
import { moveSquare } from "./stateChanges.js";
// eslint-disable-next-line
import WalkGrid from "./walkGrid.js";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Routes from "./Routes.js";
import LoggedIn from "./LoggedIn.js";
import SocketContainer from "./SocketContainer.js";
import logo from "./logo.svg";
import "./App.css";
const io = require("socket.io-client");
let socket;
// eslint-disable-next-line
const { Map, List, fromJS } = require("immutable");
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

gridInit(14, 14);
const gridHeight = grid.length;
let occupied = [];
for (let i = 0; i < 25; i += 1) {
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
const startingPoints = fromJS([
    [
        playerOneStart,
        [playerOneStart[0], playerOneStart[1] - 1],
        [playerOneStart[0], playerOneStart[1] - 1]
    ],
    [playerTwoStart]
]);
outsideState = {
    coords: startingPoints,
    occupied: fromJS(occupied),
    animated: false
};

let isKeydownAvailable = true;

grid = fromJS(grid);
class App extends Component {
    constructor(props) {
        super(props);
        this.state = outsideState;
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleKeyPress(event) {
        // Some kind of tick might make it feel less janky
        if (isKeydownAvailable) {
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
        }, 2);
    }
    componentDidMount() {
        window.addEventListener("keypress", this.handleKeyPress);
    }
    componentWillUnmount() {
        window.removeEventListener("keypress", this.handleKeyPress);
    }
    // <div className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <h2>Welcome to React</h2>
    // </div>
    // <WalkGrid
    //     coords={this.state.coords}
    //     occupied={this.state.occupied}
    //     grid={grid}
    //     gridHeight={gridHeight}
    // />
    render() {
        return (
            <div className="App" tabIndex="0">
                <SocketContainer
                    coords={this.state.coords}
                    occupied={this.state.occupied}
                    grid={grid}
                    gridHeight={gridHeight}
                />
            </div>
        );
    }
}

export default App;
