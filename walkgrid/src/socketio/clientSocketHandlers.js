const { fromJS } = require("immutable");
const exports = (module.exports = {});
exports.chatMessages = function(messages) {
    this.updateChatlogs(messages);
};

exports.rooms = function(rooms) {
    const roomObj = JSON.parse(rooms);

    if (roomObj.currentRoom) {
        this.setState({
            rooms: roomObj.rooms,
            currentRoom: roomObj.currentRoom
        });
    } else {
        this.setState({ rooms: roomObj.rooms });
    }
};

exports.error = function(error) {
    console.log(`Error: ${error}`);
    window.localStorage.clear();
    console.log(this);
    // this.close();
    return this.setState({ loggedIn: false });
};

exports.users = function(users) {
    const userObj = JSON.parse(users);
    if (userObj.currentUser !== undefined && userObj.users !== undefined) {
        return this.setState({
            users: userObj.users,
            currentUser: userObj.currentUser
        });
    } else {
        console.log(`userobj has some undefined ${JSON.stringify(userObj)}`);
        console.log(typeof userObj);
        // return this.setState({ users: userObj.users });
    }
};
exports.addAllListeners = function(socket) {
    socket.on("grid", grid => {
        return this.setState({ grid: fromJS(grid) });
    });
    socket.on("you", you => {
        return this.setState({ you: parseInt(you, 10) });
    });
    socket.on("coords", coords => {
        return this.setState({ coords: fromJS(coords) });
    });
    socket.on("occupied", occupied => {
        return this.setState({ occupied: fromJS(occupied) });
    });
    socket.on("outcome", outcome => {
        return this.setState({ outcome: outcome });
    });
    socket.on("gameHistory", gameHistory => {
        return this.setState({
            gameHistory: gameHistory
        });
    });
    socket.on("users", exports.users.bind(this));
    socket.on("userJoined", user => {
        if (!this.state.users.includes(user)) {
            this.setState({
                users: this.state.users.concat(user)
            });
        }
    });
    socket.on("userLeft", user => {
        // this.setstate remove user
        this.setState({
            users: this.state.users.filter(oldUser => oldUser !== user)
        });
    });
    socket.on("chat message", exports.chatMessages.bind(this));
    socket.on("rooms", exports.rooms.bind(this));
    socket.on("error", error => {
        console.log(`componentDidMount Error: ${error}`);
        socket.close();
        return this.setState({ loggedIn: false });
    });
    console.log(socket.listeners("error"));
};
exports.logger = function() {
    console.log(this);
};
