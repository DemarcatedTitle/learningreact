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
const map1 = Map({ a: 1, b: 2, c: 3 });
const map2 = map1.set("b", 50);
map1.get("b"); // 2
map2.get("b"); // 50
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

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <WalkGrid
                    grid={grid}
                    occupied={fromJS(occupied)}
                    gridHeight={gridHeight}
                />
            </div>
        );
    }
}

export default App;
