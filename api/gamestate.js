exports.chatters = new Map();
exports.chatlogs = new Map();
exports.rooms = new Map();
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
exports.gameHistory = [];
