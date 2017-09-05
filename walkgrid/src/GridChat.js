/* eslint-disable no-unused-vars */
import React from "react";
import WalkGrid from "./walkGrid.js";
import ChatBox from "./ChatBox.js";
class GridChat extends React.PureComponent {
    constructor(props) {
        super(props);
        // this.props.roomsProps
        // this.props.chatlogs
        // this.props.userProps
    }
    componentDidUpdate() {}
    componentWillUnmount() {}
    render() {
        return (
            <div>
                <WalkGrid
                    coords={this.props.coords}
                    occupied={this.props.occupied}
                    grid={this.props.grid}
                    gridHeight={this.props.gridHeight}
                />
                <ChatBox
                    roomsProps={this.props.roomsProps}
                    chatlogs={this.props.chatlogs}
                    usersProps={this.props.usersProps}
                />
            </div>
        );
    }
}
export default GridChat;
