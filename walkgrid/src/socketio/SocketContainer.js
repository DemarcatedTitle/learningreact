/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { Component } from "react";
import Routes from "../Routes.js";
// const { List, fromJS } = require("immutable");
const io = require("socket.io-client");
const sockethandlers = require("./clientSocketHandlers.js");
// const roomhandler = require("./clientSocketHandlers.js").rooms;
let socket;
let isKeydownAvailable = true;
class SocketContainer extends Component {
    constructor(props) {
        super(props);
        const loggedIn =
            localStorage.getItem("idtoken") !== null ? true : false;
        let listeners = false;
        if (loggedIn) {
            socket = io(`${location.host}`, {
                query: {
                    token: localStorage.getItem("idtoken")
                }
            });
            console.log("socket = located in constructor");
        }
        this.state = {
            loggedIn: loggedIn,
            chatlogs: new Map([["", []]]),
            newRoom: false,
            rooms: [],
            currentRoom: "",
            listeners: listeners,
            users: [],
            currentUser: "",
            you: "",
            outcome: "",
            gameHistory: []
        };
        this.logout = this.logout.bind(this);
        this.gameHistory = this.gameHistory.bind(this);
        this.chatMessage = this.chatMessage.bind(this);
        this.login = this.login.bind(this);
        this.joinChat = this.joinChat.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.addSocketIOListeners = sockethandlers.addAllListeners.bind(this);
    }
    logout() {
        window.localStorage.clear();
        socket.close();
        return this.setState({ loggedIn: false });
    }
    login(event, creds) {
        event.preventDefault();
        fetch("/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(creds),
            credentials: "same-origin"
        }).then(response => {
            response.json().then(data => {
                if (
                    data.idtoken !== "undefined" &&
                    data.idtoken !== undefined
                ) {
                    window.localStorage.setItem("idtoken", data.idtoken);
                    window.localStorage.setItem("username", data.username);
                    console.log("located in fetch socket =");
                    socket = io(`${location.host}`, {
                        query: {
                            token: localStorage.getItem("idtoken")
                        }
                    });

                    this.addSocketIOListeners(socket);
                    return this.setState({ loggedIn: true });
                } else {
                    return this.setState({ wrongPass: true });
                }
            });
        });
    }
    gameHistory() {
        console.log("history request function");
        socket.emit("gameHistory", "request");
    }
    createRoom(payload) {
        socket.emit("new room", payload);
    }
    chatMessage(payload) {
        socket.emit("chat message", payload);
    }
    joinChat(chatroom) {
        let tempLog = this.state.chatlogs;
        this.setState({ chatlogs: tempLog.set(chatroom, []) });
        socket.emit("join", chatroom);
    }
    updateChatlogs(messages) {
        const messagesObj = JSON.parse(messages);
        let tempLog = this.state.chatlogs;
        tempLog.set(messagesObj.room, messagesObj.logs);
        this.setState({ chatlogs: tempLog });
    }
    handleKeyPress(event) {
        // Some kind of tick might make it feel less janky
        if (isKeydownAvailable) {
            if (event.key === "ArrowUp") {
                socket.emit("keypress", event.key);
            }
            if (event.key === "ArrowDown") {
                socket.emit("keypress", event.key);
            }
            if (event.key === "ArrowLeft") {
                socket.emit("keypress", event.key);
            }
            if (event.key === "ArrowRight") {
                socket.emit("keypress", event.key);
            }
            if (event.key === "w") {
                socket.emit("keypress", event.key);
            }
            if (event.key === "s") {
                socket.emit("keypress", event.key);
            }
            if (event.key === "a") {
                socket.emit("keypress", event.key);
            }
            if (event.key === "d") {
                socket.emit("keypress", event.key);
            }
            isKeydownAvailable = false;
        }
        // Keeps movement from going crazy
        // Doesn't currently work well with two people doing this.
        // Could probably be solved by splitting it into n intervals for how many players.
        setInterval(function() {
            isKeydownAvailable = true;
        }, 2);
    }
    componentDidMount() {
        // window.addEventListener("keypress", this.handleKeyPress);
        if (this.state.loggedIn) {
            this.addSocketIOListeners(socket);
        }
    }
    componentWillUnmount() {
        // window.removeEventListener("keypress", this.handleKeyPress);
    }
    render() {
        const roomsProps = {
            rooms: this.state.rooms,
            joinChat: this.joinChat,
            currentRoom: this.state.currentRoom,
            createRoom: this.createRoom
        };
        const usersProps = {
            users: this.state.users,
            currentUser: this.state.currentUser
        };
        const chatProps = {
            usersProps: usersProps,
            roomsProps: roomsProps,
            chatlogs: this.state.chatlogs
        };
        const gridProps = {
            coords: this.state.coords,
            occupied: this.state.occupied,
            grid: this.state.grid,
            gridHeight: this.props.gridHeight,
            handleKeyPress: this.handleKeyPress,
            you: this.state.you,
            outcome: this.state.outcome
        };
        const historyProps = {
            gameHistoryRequest: this.gameHistory,
            gameHistory: this.state.gameHistory
        };
        return (
            <Routes
                loggedIn={this.state.loggedIn}
                logout={this.logout}
                wrongPass={this.state.wrongPass}
                login={this.login}
                gridProps={gridProps}
                chatProps={chatProps}
                historyProps={historyProps}
                socket={socket}
            />
        );
    }
}
export default SocketContainer;
