/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from "react";

class MobileControls extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="MobileControls">
                <MobileButton
                    handleKeyPress={this.props.handleKeyPress}
                    direction={"left"}
                />
                <div className="MobileControls">
                    <MobileButton
                        className="up"
                        handleKeyPress={this.props.handleKeyPress}
                        direction={"up"}
                    />
                    <MobileButton
                        handleKeyPress={this.props.handleKeyPress}
                        direction={"down"}
                    />
                </div>
                <MobileButton
                    handleKeyPress={this.props.handleKeyPress}
                    direction={"right"}
                />
                <div className="griddetected"> Grid Detected </div>
            </div>
        );
    }
}
let arrows = {
    right: "➡️",
    left: "⬅️",
    up: "⬆️",
    down: "⬇️"
};
class MobileButton extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.simulateKeyPress = this.simulateKeyPress.bind(this);
    }
    simulateKeyPress() {
        let event = {};
        let keys = {
            up: "w",
            down: "s",
            left: "a",
            right: "d"
        };
        event.key = keys[this.props.direction];
        this.props.handleKeyPress(event);
    }
    onTouchStart() {
        let event = {};
        let keys = {
            up: "w",
            down: "s",
            left: "a",
            right: "d"
        };
        event.key = keys[this.props.direction];
        this.props.handleKeyPress(event);
        console.log(this.props.handleKeyPress);
        console.log(this.props.direction);
    }
    render() {
        let classes = `${this.props.className} MobileButton`;
        return (
            <div onTouchStart={this.onTouchStart} className={classes}>
                <div>{arrows[this.props.direction]}</div>
            </div>
        );
    }
}
export default MobileControls;
