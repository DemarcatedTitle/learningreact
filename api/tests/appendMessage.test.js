const appendMessage = require("../appendMessage.js");
test("Empty chat log arr now has a new message object", () => {
    const currDate = new Date();
    const message = "The first message";
    const username = "server";
    const logs = [];
    expect(appendMessage(logs, currDate, message, username)).toEqual([
        { date: currDate, message: message, username: username }
    ]);
});
test("A chat log arr with one chat message now has the new message at the end", () => {
    const prevDate = new Date();
    const message = "the second message";
    const username = "server";
    const currDate = new Date();
    const logs = [
        { date: prevDate, message: "The First message", username: "not server" }
    ];
    expect(appendMessage(logs, currDate, message, username)).toEqual([
        {
            date: prevDate,
            message: "The First message",
            username: "not server"
        },
        {
            date: currDate,
            message: message,
            username: username
        }
    ]);
});
test("If logs isn't an array, throw error", () => {
    const currDate = new Date();
    const message = "The first message";
    const username = "server";
    const logs = [];
    expect(() => {
        appendMessage(undefined, currDate, message, username);
    }).toThrow();
});
