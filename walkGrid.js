/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
//Plans:
//I want to be able to set the grid size in the browser
//I want to be able to set the grid size dynamically
//I want the active square to be set somewhere in the middle of the dynamically set grid size
//
//I want to be able to have multiple 'character' squares
//I want to use more than one key to perform an action
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

class WalkGrid extends React.Component {
    constructor(props) {
        super(props);
        const playerOneStart = [
            parseInt(grid.length / 2),
            parseInt(grid[1].length / 2)
        ];
        const playerTwoStart = [
            parseInt(grid.length / 2),
            parseInt(grid[1].length / 2)
        ];
        this.state = {
            coords: [playerOneStart, playerTwoStart]
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
    }
    toggleActive() {
        this.setState(prevState => ({
            active: !prevState.active
        }));
    }
    handleKeyPress(event) {
        if (event.key == "ArrowUp") {
            this.setState(moveSquare(this.state.coords, 0, "up"));
        }
        if (event.key == "ArrowDown") {
            this.setState(moveSquare(this.state.coords, 0, "down"));
        }
        if (event.key == "ArrowLeft") {
            this.setState(moveSquare(this.state.coords, 0, "left"));
        }
        if (event.key == "ArrowRight") {
            this.setState(moveSquare(this.state.coords, 0, "right"));
        }
        if (event.key == "w") {
            this.setState(moveSquare(this.state.coords, 1, "up"));
        }
        if (event.key == "s") {
            this.setState(moveSquare(this.state.coords, 1, "down"));
        }
        if (event.key == "a") {
            this.setState(moveSquare(this.state.coords, 1, "left"));
        }
        if (event.key == "d") {
            this.setState(moveSquare(this.state.coords, 1, "right"));
        }
    }
    componentWillMount() {
        window.addEventListener("keypress", this.handleKeyPress);
    }
    componentWillUnmount() {
        window.removeEventListener("keypress", this.handleKeyPress);
    }
    render() {
        const grid = this.props.grid;
        let coords = this.state.coords;
        return (
            <div>
                <div className="Announcement">
                    <AnnouncementBox player={{ name: 0, coords: coords[0] }} />
                    <AnnouncementBox player={{ name: 1, coords: coords[1] }} />
                </div>
                <Rows coords={coords} />
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
        if (
            this.props.player.coords[0] >= gridHeight ||
            this.props.player.coords[1] >= gridHeight
        ) {
            outOfBounds = true;
        }
        const isOutOfBounds = outOfBounds ? "Player is out of bounds" : "";
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
        let classes = `space ${active ? "active" : ""}`;
        return <div className={classes} />;
    }
}

class Rows extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let coords = this.props.coords;
        const rows = grid.map(function(row) {
            return (
                <div className="row" key={row.toString()}>
                    {row.map(function(square) {
                        let active = false;
                        if (
                            square.toString() == coords[0].toString() ||
                            square.toString() == coords[1].toString()
                        ) {
                            active = true;
                        }
                        return (
                            <Space key={square.toString()} active={active} />
                        );
                    })}
                </div>
            );
        });
        return <div>{rows}</div>;
    }
}

ReactDOM.render(<WalkGrid grid={grid} />, document.getElementById("root"));
