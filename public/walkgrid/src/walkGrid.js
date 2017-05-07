/* eslint-disable no-useless-constructor */
// eslint-disable-next-line
import React from "react";
// eslint-disable-next-line
import { coordCheckInit, moveSquare } from "./stateChanges.js";
// eslint-disable-next-line
import { List, fromJS } from "immutable";
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
//Plans:
//I want to be able to set the grid size in the browser
//I want to be able to set the grid size dynamically
//I want the active square to be set somewhere in the middle of the dynamically set grid size
//
//I want to be able to have multiple 'character' squares
//I want to use more than one key to perform an action

class WalkGrid extends React.Component {
    constructor(props) {
        super(props);
        const grid = this.props.grid;
        const gridHeight = this.props.gridHeight;
        const playerOneStart = [
            parseInt(grid.length / 2, 10),
            parseInt(grid[1].length / 2, 10)
        ];
        const playerTwoStart = [
            parseInt(grid.length / 2, 10),
            parseInt(grid[1].length / 2, 10)
        ];
        const startingPoints = fromJS([
            [playerOneStart, [14, 14]],
            [playerTwoStart]
        ]);
        let coordCheck = startingPoints.flatten(1);
        this.state = {
            coords: startingPoints,
            coordCheck: coordCheck
            // coordCheck
        };
        // this.setState({ coordCheck: coordCheckInit(this.state) });
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleKeyPress(event) {
        if (event.key === " ") {
            console.log(`coordCheck ${this.state.coordCheck.join(",")}`);
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
    }
    componentWillMount() {
        window.addEventListener("keypress", this.handleKeyPress);
    }
    componentWillUnmount() {
        window.removeEventListener("keypress", this.handleKeyPress);
    }
    render() {
        let coords = this.state.coords;
        return (
            <div>
                <div className="Announcement">
                    <AnnouncementBox
                        gridHeight={this.props.gridHeight}
                        player={{ name: 0, coords: coords.get(0).get(0) }}
                    />
                    <AnnouncementBox
                        gridHeight={this.props.gridHeight}
                        player={{ name: 1, coords: coords.get(1).get(0) }}
                    />
                </div>
                <Rows
                    grid={this.props.grid}
                    occupied={this.props.occupied}
                    coords={coords}
                    coordCheck={this.state.coordCheck}
                />
            </div>
        );
    }
}
class AnnouncementBox extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        let outOfBounds = false;
        const gridHeight = this.props.gridHeight;
        if (
            this.props.player.coords.get(0) >= gridHeight ||
            this.props.player.coords.get(1) >= gridHeight
        ) {
            outOfBounds = true;
        }
        let isOutOfBounds = outOfBounds ? "Player is out of bounds" : "";
        let classes = `${outOfBounds ? "outOfBounds" : ""}`;
        return (
            <div className={classes}>
                {`Player ${this.props.player.name} Coordinates: ${this.props.player.coords.toString()}  ${isOutOfBounds}`}
            </div>
        );
    }
}

class Space extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const active = this.props.active;
        const food = this.props.food;
        let classes = `space ${food ? "food" : ""} ${active ? "active" : ""}`;
        return <div className={classes} />;
    }
}

class Rows extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const coords = this.props.coords;
        const coordCheck = this.props.coordCheck;
        const flatterCoords = coords.flatten(1);
        const occupied = this.props.occupied;
        let grid = fromJS(this.props.grid);
        const rows = grid.map(function(row) {
            // if (occupied.includes(square.toString())) {
            //     food = true;
            // }
            return (
                <div className="row" key={row.toString()}>

                    {row.map(function(square) {
                        let active = false;
                        let food = false;
                        if (
                            flatterCoords.includes(square) ||
                            coordCheck.includes(square)
                        ) {
                            active = true;
                        }
                        return (
                            <Space
                                key={square.toString()}
                                active={active}
                                food={food}
                            />
                        );
                    })}

                </div>
            );
        });
        return <div>{rows}</div>;
    }
}

export default WalkGrid;
// ReactDOM.render(<WalkGrid grid={grid} />, document.getElementById("root"));
