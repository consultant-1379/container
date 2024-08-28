var RSVP = require('rsvp'),
    shelljs = require('shelljs'),
    prod = require('./prod');

module.exports = prod.fork({
    name: 'backwards-compatibility/libs',
    prepare: function (dest) {
        return new RSVP.Promise(function(resolve, reject) {
            shelljs.cp('-Rf', 'test/acceptance/backwards-compatibility/libs/config.js', dest + 'myapp/');
            resolve();
        });
    }
});
