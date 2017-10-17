exports.chatters = new Map();
// key = socket.id
// value = username
exports.chatlogs = new Map();
// key = currentRoom
// value = [{date, username, message},...]
exports.rooms = new Map();
// key = currentRoom Name
// value = io namespace
exports.games = new Map();
// Individual game state will be kept here
// It will contain:
// "coords" list of lists
// "occupied" list of lists
// "grid" array of arrays
// "players" Map
// a "collision" object
// an "outcome" string.

exports.activePlayers = new Map();
// key = username
// value = currentRoom
exports.gameHistory = [];
