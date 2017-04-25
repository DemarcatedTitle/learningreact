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
            yArray.push(`${i}${j}`);
        }
        grid.push(yArray);
    }
}

gridInit(5, 5);

function WalkGrid(props) {
    const grid = props.grid;
    const rows = grid.map(function(row) {
        return (
            <div className="row" key={row.toString()}>
                {row.map(function(square) {
                    return (
                        <Space
                            coords={square.toString()}
                            key={square.toString()}
                        />
                    );
                })}
            </div>
        );
    });
    return <div> {rows} </div>;
}

class Space extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        console.log(`Coords: ${this.props.coords}`);
        this.setState(prevState => ({
            active: !prevState.active
        }));
    }
    render() {
        let active = this.state.active;
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

// class Row extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return (
//             <div className="row" key={row.toString()}>
//                 {row.map(space => (
//                     <div
//                         onClick={props.onClick}
//                         className="Space"
//                         key={space.toString()}
//                     />
//                 ))}

//             </div>
//         );
//     }
// }
// class WalkGrid extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { active: false };
//         this.handleToggleClick = this.handleToggleClick.bind(this);
//     }
//     handleToggleClick() {
//         this.setState(prevState => ({
//             active: !prevState.active
//         }));
//     }
//     render() {
//         return <div> {grid.map(Row.render)} </div>;
//     }
// }
//
//
//*****************What <Space> was previously
// (
//     <div
//         onClick={props.onClick}
//         className="space"
//         key={space.toString()}
//     />
// ))
ReactDOM.render(<WalkGrid grid={grid} />, document.getElementById("root"));
