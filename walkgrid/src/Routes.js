/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-useless-constructor */
import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import SocketContainer from "./socketio/SocketContainer.js";
import PrivateRoute from "./PrivateRoute.js";
import ChatBox from "./chat/ChatBox.js";
import GridChat from "./GridChat.js";
import LoggedIn from "./account/LoggedIn.js";
import Login from "./Login.js";
import NewRoom from "./chat/NewRoom.js";
import Rooms from "./chat/Rooms.js";
const io = require("socket.io-client");
const sockethandlers = require("./socketio/clientSocketHandlers.js");
const roomhandler = require("./socketio/clientSocketHandlers.js").rooms;

class Routes extends Component {
    constructor(props) {
        super(props);
    }
    updateChatlogs(messages) {
        const messagesObj = JSON.parse(messages);
        let tempLog = this.state.chatlogs;
        tempLog.set(messagesObj.room, messagesObj.logs);
        this.setState({ chatlogs: tempLog });
    }
    render() {
        return (
            <Router>
                <div>
                    <ul className="App-header">
                        <li>
                            this.props.loggedIn:
                            {" "}
                            {this.props.loggedIn.toString()}
                            {" "}
                        </li>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/auth">Auth</Link></li>
                        <LoggedIn
                            logout={this.props.logout}
                            loggedIn={this.props.loggedIn}
                        />
                    </ul>

                    <hr />
                    <div>
                        <Route
                            exact
                            path="/login"
                            render={routeProps => (
                                <Login
                                    {...routeProps}
                                    wrongPass={this.props.wrongPass}
                                    loggedIn={this.props.loggedIn}
                                    login={this.props.login}
                                />
                            )}
                        />
                        <PrivateRoute
                            test={"this is a test"}
                            loggedIn={this.props.loggedIn}
                            socket={this.props.socket}
                            gridProps={this.props.gridProps}
                            chatProps={this.props.chatProps}
                            exact
                            path="/"
                            component={GridChat}
                        />
                        <PrivateRoute
                            gridProps={this.props.gridProps}
                            chatProps={this.props.chatProps}
                            loggedIn={this.props.loggedIn}
                            socket={this.props.socket}
                            path="/auth"
                            component={GridChat}
                        />
                    </div>
                </div>
            </Router>
        );
    }
}
export default Routes;
