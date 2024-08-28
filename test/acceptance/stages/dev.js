var shelljs = require('shelljs'),
    RSVP = require('rsvp'),
    Stage = require('../Stage');

var root = 'test/acceptance/',
    packageDev = 'target/package-dev/container/';

module.exports = new Stage({
    name: 'dev',
    prepare: function (dest) {
        shelljs.mkdir('-p', dest + 'node_modules/container')
        shelljs.cp('-Rf', packageDev, dest + 'node_modules/container');
        shelljs.cp('-R', packageDev + 'index.html', dest);
        shelljs.cp('-R', root + 'apps/*', dest + 'src/');
        shelljs.cp('-R', 'node_modules/jscore', dest + 'node_modules/');
        shelljs.cp('-R', root + 'dev/*', dest);
        return new RSVP.Promise(function(resolve, reject) {
            resolve();
        });
    }
});
