// eslint-disable-next-line
import React from "react";
const { List, fromJS } = require("immutable");
/* eslint-disable no-console */
//Plans:
// [ ]I want to be able to set the grid size in the browser
// [x]I want to be able to set the grid size dynamically
// [x]I want the you square to be set somewhere in the middle of the dynamically set grid size
//
// [x]I want to be able to have multiple 'character' squares
// [ ]I want to use more than one key to perform an action

class WalkGrid extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    componentWillMount() {}
    componentWillUnmount() {}
    handleClick() {}
    handleKeyPress(event) {
        this.props.handleKeyPress(event);
    }
    render() {
        const coords = this.props.coords;
        if (
            this.props.grid !== null &&
            this.props.coords !== null &&
            this.props.occupied !== null &&
            typeof this.props.you === "number" &&
            isNaN(this.props.you) === false
        ) {
            return (
                <div
                    tabIndex="0"
                    onClick={this.handleClick}
                    onKeyPress={this.handleKeyPress}
                >
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
                        you={this.props.you}
                    />
                </div>
            );
        } else {
            return (
                <div className="spacer validationErr">
                    <p>The grid has not yet loaded.</p>
                </div>
            );
        }
    }
}
// eslint-disable-next-line
class AnnouncementBox extends React.PureComponent {
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
    render() {
        const you = this.props.you;
        const food = this.props.food;
        const enemy = this.props.enemy;
        const classes = `space ${food ? "food" : ""} ${you ? "you" : ""} ${enemy ? "enemy" : ""}`;
        return <div className={classes} />;
    }
}

// eslint-disable-next-line
class Rows extends React.PureComponent {
    render() {
        console.log(this.props.you);
        const coords = this.props.coords.get(this.props.you);
        const yourPlayer = this.props.you;
        const opponent = yourPlayer === 1 ? 0 : 1;
        const opCoords = this.props.coords.get(opponent);
        const flatterCoords = coords;
        const occupied = this.props.occupied;
        const grid = this.props.grid;
        // *********
        // Maybe if I put the maps somewhere it only happens once, and then do some kind of filter
        // thing or something where the iteration only happens over specific elements
        // *********
        const rows = grid.map(function(row) {
            // I believe performing two maps or rendering that many squares (25x25)
            // is what is causing this to not perform as fast as I would like.
            // There also may be other factors like the conditionals and functions running
            // inside of them like .includes, .join
            //
            // Ideas:
            // Maybe some kind of memoization?
            // Maybe another thing being tracked that says whether or not there has been a change
            // row specific
            //
            //
            return (
                <div className="row" key={row}>
                    {row.map(function(square) {
                        const you = flatterCoords.includes(square)
                            ? true
                            : false;
                        const food = occupied.includes(square) ? true : false;
                        const enemy = opCoords.includes(square) ? true : false;
                        return (
                            <Space
                                key={square}
                                you={you}
                                enemy={enemy}
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
