/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-useless-constructor */
import React from "react";
import WalkGrid from "./walkGrid.js";
import ChatBox from "./chat/ChatBox.js";
class GridChat extends React.PureComponent {
    constructor(props) {
        super(props);
        this.toggleChat = this.toggleChat.bind(this);
        // this.props.roomsProps
        // this.props.chatlogs
        // this.props.userProps
        this.state = {
            chatHidden: false
        };
    }
    toggleChat() {
        this.setState({ chatHidden: !this.state.chatHidden });
    }
    componentDidMount() {
        if (
            this.props.gridProps.grid !== null &&
            this.props.gridProps.coords !== null &&
            this.props.gridProps.occupied !== null &&
            typeof this.props.gridProps.you === "number" &&
            isNaN(this.props.gridProps.you) === false
        ) {
            // this.toggleChat();
            document.scrollIntoView(
                document.getElementsByClassName("outcome")[0]
            );
        }
    }
    componentWillUnmount() {}
    render() {
        let hidden;
        if (this.state.chatHidden === false) {
            hidden = "";
        } else {
            hidden = "hidden";
        }
        return (
            <div className="GridChat">
                <WalkGrid
                    socket={this.props.socket}
                    coords={this.props.gridProps.coords}
                    occupied={this.props.gridProps.occupied}
                    grid={this.props.gridProps.grid}
                    handleKeyPress={this.props.gridProps.handleKeyPress}
                    gridHeight={this.props.gridProps.gridHeight}
                    you={this.props.gridProps.you}
                    outcome={this.props.gridProps.outcome}
                />
                <div className="chatBubble" onClick={this.toggleChat}>
                    <div className="unselectable">🗨️</div>
                </div>
                <ChatBox
                    className={hidden}
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
