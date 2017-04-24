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
console.log(grid);
function WalkGrid(props) {
    const grid = props.grid;
    const rows = grid.map(row => (
        <div className="row" key={row.toString()}>
            {row.map(space => <div className="space" key={space.toString()} />)}
        </div>
    ));
    return <div> {rows} </div>;
}
ReactDOM.render(<WalkGrid grid={grid} />, document.getElementById("root"));
