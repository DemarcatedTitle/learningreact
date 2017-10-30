// recWalkAxis: use callback function set amount of times
module.exports = function recWalkAxis(amount, ms, args, callback, newVals) {
    return new Promise(resolve => {
        if (amount > 0) {
            setTimeout(
                function(args) {
                    callback(args).then(data => {
                        resolve(data);
                        recWalkAxis(amount - 1, ms, args, callback, data);
                    });
                },
                ms,
                args,
                resolve
            );
        } else {
            if (newVals !== undefined) {
                resolve(newVals);
            } else {
                resolve();
            }
        }
    });
};
