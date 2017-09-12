/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import React from "react";
import WalkGrid from "./walkGrid.js";
import ChatBox from "./chat/ChatBox.js";
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
            <div className="GridChat">
                <WalkGrid
                    socket={this.props.socket}
                    coords={this.props.gridProps.coords}
                    occupied={this.props.gridProps.occupied}
                    grid={this.props.gridProps.grid}
                    handleKeyPress={this.props.gridProps.handleKeyPress}
                    gridHeight={this.props.gridProps.gridHeight}
                />
                <ChatBox
                    socket={this.props.socket}
                    roomsProps={this.props.chatProps.roomsProps}
                    chatlogs={this.props.chatProps.chatlogs}
                    usersProps={this.props.chatProps.usersProps}
                />
            </div>
        );
    }
}
export default GridChat;
