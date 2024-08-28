var shelljs = require('shelljs'),
    Stage = require('../Stage'),
    RSVP = require('rsvp');

var root = 'test/acceptance/',
    packageProd = 'target/package/';

module.exports = new Stage({
    name: 'prod',
    prepare: function (dest) {
        shelljs.cp('-R', root + 'prod/*', dest);
        shelljs.cp('-R', packageProd, dest);
        shelljs.cp('-R', root + '/apps/*', dest);
        shelljs.cp('-R', 'node_modules/jscore', dest)
        return new RSVP.Promise(function(resolve, reject) {
            resolve();
        });
    }
});
