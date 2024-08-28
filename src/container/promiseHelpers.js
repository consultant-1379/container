define([
    './promise'
], function (Promise) {

    return {
        resolvedPromise: function (val) {
            return new Promise(function (resolve, reject) {
                resolve(val);
            });
        },

        requirePromise: function (deps, config) {
            return new Promise(function (resolve, reject) {
                if (config) {
                    require(config, deps, function () {
                        resolve(arguments);
                    }, reject);
                } else {
                    require(deps, function () {
                        resolve(arguments);
                    }, reject);
                }
            });
        }
    };

});
