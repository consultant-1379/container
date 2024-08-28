var RSVP = require('rsvp'),
    shelljs = require('shelljs'),
    prod = require('./prod');

module.exports = prod.fork({
    name: 'prod-custom-name',
    prepare: function (dest) {
        return new RSVP.Promise(function(resolve, reject) {
            shelljs.cp('-Rf', 'test/acceptance/config-custom-name/config.js', dest);
            resolve();
        });
    }
});
