var RSVP = require('rsvp'),
    shelljs = require('shelljs'),
    dev = require('./dev');

module.exports = dev.fork({
    name: 'dev-custom-name',
    prepare: function (dest) {
        return new RSVP.Promise(function(resolve, reject) {
            shelljs.cp('-Rf', 'test/acceptance/config-custom-name/config.js', dest + 'container.config.js');
            resolve();
        });
    }
});
