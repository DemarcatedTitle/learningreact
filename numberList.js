/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
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

gridInit(5, 5);
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
        this.state = { coords: [2, 2] };
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
            let newCoords = this.state.coords;
            newCoords[0]--;
            this.setState(prevState => ({
                coords: newCoords
            }));
        }
        if (event.key == "ArrowDown") {
            let newCoords = this.state.coords;
            newCoords[0]++;
            this.setState(prevState => ({
                coords: newCoords
            }));
        }
        if (event.key == "ArrowLeft") {
            let newCoords = this.state.coords;
            newCoords[1]--;
            this.setState(prevState => ({
                coords: newCoords
            }));
        }
        if (event.key == "ArrowRight") {
            let newCoords = this.state.coords;
            newCoords[1]++;
            this.setState(prevState => ({
                coords: newCoords
            }));
        }
        // event.persist();
        // const test = event;
        // this.setState(prevState => ({
        //     active: !prevState.active
        // }));
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
        const rows = grid.map(function(row) {
            return (
                <div className="row" key={row.toString()}>
                    {row.map(function(square) {
                        let active = false;
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
        return (
            //Tab index seems to be pretty important here
            <div> {rows} </div>
        );
    }
}

class Space extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { active: false };
        this.handleClick = this.handleClick.bind(this);
        // this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleClick() {
        this.setState(prevState => ({
            active: !prevState.active
        }));
    }
    handleChange(event) {
        this.props.onActiveChange(event.targetvalue);
    }
    // handleKeyPress(event) {
    //     event.persist();
    //     const test = event;
    //     console.log("keypress");
    //     this.setState(prevState => ({
    //         active: !prevState.active
    //     }));
    // }
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
