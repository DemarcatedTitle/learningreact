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
//
function NumberList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map(number => (
        <li key={number.toString()}> {number} </li>
    ));
    return <ol> {listItems} </ol>;
}

let grid = [];
const numbers = [1, 2, 3, 4, 5];

function gridInit(x, y) {
    for (let i = 0; i < x; i++) {
        let yArray = [];
        for (let j = 0; j < y; j++) {
            yArray.push(`${i},${j}`);
        }
        grid.push(yArray);
    }
}

gridInit(9, 9);
class App extends React.Component {
    constructor(props) {
        super(props);
    }
}

//Perhaps something like a this.state = { characters: [[x,y], [x,y]...] }
//And then iterative conditional formatting to set active
//like, if (coords in characters) { class = active}
//
//General purpose stepping functions
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
            playerOneCoords: playerOneStart,
            playerTwoCoords: playerTwoStart
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
        const config = [];
    }
    toggleActive() {
        this.setState(prevState => ({
            active: !prevState.active
        }));
    }
    handleKeyPress(event) {
        if (event.key == "ArrowUp") {
            this.setState(moveSquare(this.state, "playerOneCoords", "up"));
        }
        if (event.key == "ArrowDown") {
            this.setState(moveSquare(this.state, "playerOneCoords", "down"));
        }
        if (event.key == "ArrowLeft") {
            this.setState(moveSquare(this.state, "playerOneCoords", "left"));
        }
        if (event.key == "ArrowRight") {
            this.setState(moveSquare(this.state, "playerOneCoords", "right"));
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
        let coords = this.state.playerOneCoords;
        const rows = grid.map(function(row) {
            return (
                <div className="row" key={row.toString()}>
                    {row.map(function(square) {
                        let active = false;
                        // I should figure out a way to use this with multiple squares simultaneously
                        if (square.toString() == coords.toString()) {
                            active = true;
                        }
                        return (
                            <div key={square.toString() + "parent"}>
                                <Space
                                    key={square.toString()}
                                    active={active}
                                />
                            </div>
                        );
                    })}
                </div>
            );
        });
        return <div> {rows} </div>;
    }
}

class Space extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState(prevState => ({
            active: !prevState.active
        }));
    }
    handleChange(event) {
        this.props.onActiveChange(event.targetvalue);
    }
    render() {
        const active = this.props.active;
        let classes = `space ${active ? "active" : ""}`;
        return <div onClick={this.handleClick} className={classes} />;
    }
}

class Row extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        this.props.row.map(console.log(this));
    }
}

// function WalkGrid(props) {//{{{
//     const grid = props.grid;
//     const rows = grid.map(function(row) {
//         return (
//             <div className="row" key={row.toString()}>
//                 {row.map(function(square) {
//                     return (
//                         <Space
//                             coords={square.toString()}
//                             key={square.toString()}
//                         />
//                     );
//                 })}
//             </div>
//         );
//     });
//     return <div> {rows} </div>;
// }
//*****************What <Space> was previously
// (
//     <div
//         onClick={props.onClick}
//         className="space"
//         key={space.toString()}
//     />
// ))//}}}
ReactDOM.render(<WalkGrid grid={grid} />, document.getElementById("root"));
