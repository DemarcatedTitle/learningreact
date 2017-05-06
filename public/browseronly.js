/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function formatName(user) {
    return user.firstName + " " + user.lastName;
}
const user = {
    firstName: "harper",
    lastName: "perez"
};
const greeting = (
    <h1>
        Hello, {formatName(user)}!
    </h1>
);
// function Clock(props) {
//     return (
//         <div>
//             <h1>Only relevant things get updated</h1>
//             <h2>It is {props.date.toLocaleTimeString()}.</h2>
//         </div>
//     );
// }
function App() {
    return (
        <div>
            <Replicator />
        </div>
    );
}
function tick() {
    ReactDOM.render(<App />, document.getElementById("root"));
}
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }
    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        this.setState({
            date: new Date()
        });
    }
    render() {
        return (
            <div>
                It is {this.state.date.toLocaleTimeString()}.
            </div>
        );
    }
}
class ReplicateClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }
    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        this.setState({
            date: new Date()
        });
    }
    render() {
        return (
            <div>
                It is {this.state.date.toLocaleTimeString()}.
            </div>
        );
    }
}

//I think this might be the wrong way to do it.
class Replicator extends React.Component {
    constructor(props) {
        super(props);
        const currentTime = new Date();
        this.state = {
            date: `It is ${currentTime.toLocaleTimeString()}`
        };
    }
    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        this.setState((prevState, props) => {
            const currentTime = new Date();
            return { date: prevState.date + currentTime.toLocaleTimeString() };
        });
    }
    render() {
        return (
            <div>
                {this.state.date}.
            </div>
        );
    }
}
class CopyClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { clocks: [] };
    }
    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    tick() {
        this.setState({
            date: new Date()
        });
    }
    render() {
        return <div />;
    }
}

setInterval(tick, 1000);
