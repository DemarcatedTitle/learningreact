// eslint-disable-next-line
import React from "react";
// eslint-disable-next-line
import { nonPlayerCoordsInit, moveSquare } from "./stateChanges.js";
// eslint-disable-next-line
import { List, fromJS } from "immutable";
/* eslint-disable no-console */
//Plans:
//I want to be able to set the grid size in the browser
//I want to be able to set the grid size dynamically
//I want the active square to be set somewhere in the middle of the dynamically set grid size
//
//I want to be able to have multiple 'character' squares
//I want to use more than one key to perform an action

class WalkGrid extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    componentWillMount() {}
    componentWillUnmount() {}
    render() {
        const coords = this.props.coords;
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
                    nonPlayerCoords={this.props.nonPlayerCoords}
                />
            </div>
        );
    }
}
// eslint-disable-next-line
class AnnouncementBox extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const gridHeight = this.props.gridHeight;
        const outOfBounds = this.props.player.coords.get(0) >= gridHeight ||
            this.props.player.coords.get(1) >= gridHeight ||
            this.props.player.coords.get(0) < 0 ||
            this.props.player.coords.get(1) < 0
            ? true
            : false;
        // if (
        //     this.props.player.coords.get(0) >= gridHeight ||
        //     this.props.player.coords.get(1) >= gridHeight
        // ) {
        //     outOfBounds = true;
        // }
        const isOutOfBounds = outOfBounds ? "Player is out of bounds" : "";
        const classes = `${outOfBounds ? "outOfBounds" : ""}`;
        return (
            <div className={classes}>
                {`Player ${this.props.player.name} Coordinates: ${this.props.player.coords.join(",")}  ${isOutOfBounds}`}
            </div>
        );
    }
}

// eslint-disable-next-line
class Space extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const active = this.props.active;
        const food = this.props.food;
        const classes = `space ${food ? "food" : ""} ${active ? "active" : ""}`;
        return <div className={classes} />;
    }
}

// eslint-disable-next-line
class Rows extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const coords = this.props.coords;
        const nonPlayerCoords = this.props.nonPlayerCoords;
        const flatterCoords = coords.flatten(1);
        const occupied = this.props.occupied;
        const grid = this.props.grid;
        const rows = grid.map(function(row) {
            // I believe performing two maps or rendering that many squares (25x25)
            // is what is causing this to not perform as fast as I would like.
            // There also may be other factors like the conditionals and functions running
            // inside of them like .includes, .join
            return (
                <div className="row" key={row}>

                    {row.map(function(square) {
                        const active = flatterCoords.includes(square) ||
                            nonPlayerCoords.includes(square)
                            ? true
                            : false;
                        const food = occupied.includes(square) ? true : false;
                        return (
                            <Space key={square} active={active} food={food} />
                        );
                    })}

                </div>
            );
        });
        return <div>{rows}</div>;
    }
}

export default WalkGrid;
