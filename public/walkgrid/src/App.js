import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./main.css";
import { coordCheckInit, moveSquare } from "./stateChanges.js";
import WalkGrid from "./walkGrid.js";
const { Map } = require("immutable");
const map1 = Map({ a: 1, b: 2, c: 3 });
const map2 = map1.set("b", 50);
map1.get("b"); // 2
map2.get("b"); // 50
// console.log(map2.get("b"));
// works^

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
            yArray.push(`${i},${j}`);
        }
        grid.push(yArray);
    }
}

gridInit(25, 25);
const gridHeight = grid.length;
const gridWidth = grid[0].length;
let occupied = [];
for (let i = 0; i < gridHeight; i += 1) {
    occupied.push(
        [getRandomInt(0, gridHeight), getRandomInt(0, gridHeight)].toString()
    );
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
                    occupied={occupied}
                    gridHeight={gridHeight}
                />
            </div>
        );
    }
}

export default App;
