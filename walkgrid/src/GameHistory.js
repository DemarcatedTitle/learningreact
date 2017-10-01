/* eslint-disable no-console */
/* eslint-disable no-useless-constructor */
import React from "react";
// import Rooms from "./Rooms.js";
// import Users from "./Users.js";
import moment from "moment";
class GameHistory extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    handleSubmit(event) {}
    handleChange(event) {}
    componentDidUpdate() {}
    componentDidMount() {
        this.props.historyProps.gameHistoryRequest();
    }
    componentWillUnmount() {}
    render() {
        console.log(this.props.historyProps.gameHistory);
        if (this.props.historyProps.gameHistory.length > 0) {
            return (
                <div>
                    <ul>
                        {this.props.historyProps.gameHistory.map(function(
                            match,
                            index
                        ) {
                            return (
                                <li className="history" key={index}>
                                    <p className="player">
                                        {moment(match.date).format(
                                            "MM/DD/YY hh:mm a"
                                        )}
                                    </p>
                                    <p className="player">{match.players[0]}</p>
                                    <p>vs</p>
                                    <p className="player">{match.players[1]}</p>
                                    <p className="outcome">{match.outcome}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        } else {
            return (
                <div>
                    <p className="outcome">
                        It looks like nobody has played a game yet.
                    </p>
                </div>
            );
        }
    }
}
export default GameHistory;
