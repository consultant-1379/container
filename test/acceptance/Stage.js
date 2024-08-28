var shelljs = require('shelljs'),
    RSVP = require('rsvp');

function Stage (options) {
    this.options = options;
    this.options.target = 'target/test/acceptance/stages/' + (this.options.name ? this.options.name : Math.random()) + '/';
}

Stage.prototype = {
    getUrl: function () {
        return this.options.target;
    },

    build: function (path) {
        this.buildPromise = this.buildPromise || new RSVP.Promise(function(resolve, reject) {
            this.options.depends = this.options.depends || [];
            var dependendies = this.options.depends.map(function (dep) {
                return dep.build().then(function () {
                    shelljs.mkdir('-p', this.options.target);
                    shelljs.cp('-R', dep.getUrl(), this.options.target);
                }.bind(this));
            }.bind(this));
            RSVP.all(dependendies).then(function () {
                if (this.options.prepare) {
                    this.options.prepare(this.options.target).then(resolve);
                } else {
                    resolve();
                }
            }.bind(this));
        }.bind(this));
        return this.buildPromise;
    },

    fork: function (options) {
        options.depends = [this];
        return new Stage(options);
    }
}

module.exports = Stage;
