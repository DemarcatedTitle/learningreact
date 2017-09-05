module.exports = {
    isAuthenticated: function() {
        if (
            localStorage.getStore("idtoken") !== "undefined" ||
            localStorage.getStore("idtoken") !== null
        ) {
            return true;
        } else {
            return false;
        }
    }
};
