/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function formatName(user) {
    return user.firstName + " " + user.lastName;
}
const user = {
    firstName: "harper",
    lastName: "perez"
};
const greeting = (
    <h1>
        Hello, {formatName(user)}!
    </h1>
);
function tick() {
    const clock = (
        <div>
            <h1>Only relevant things get updated</h1>
            <h2>It is {new Date().toLocaleTimeString()}.</h2>
        </div>
    );
    ReactDOM.render(
        clock, document.getElementById("root"));
}
setInterval(tick, 1000);
