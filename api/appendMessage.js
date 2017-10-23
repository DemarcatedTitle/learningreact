function appendMessage(logs, currDate, message, user) {
    if (Array.isArray(logs)) {
        return logs.concat({ date: currDate, message: message, user: user });
    } else {
        throw "logs argument is not an array";
    }
}
module.exports = appendMessage;
