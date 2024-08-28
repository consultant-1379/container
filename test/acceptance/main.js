var fs = require('fs');

casper.options.clientScripts = ['test/acceptance/patchBind.js'];


casper.on('remote.message', function (message) {
    casper.echo(message);
});
casper.on('http.status.404', function (resource) {
    casper.echo(resource.url + ' is 404');
});
casper.on('resource.error', function (resource) {
    casper.echo(resource.url);
});

var test = function (name, fn, url) {
    casper.test.begin(name, function (test) {
        casper.on('page.error', function (message) {
            test.fail(message);
        });

        casper.start(url);
        fn(test);

        casper.run(function() {
            this.clear();
            test.done();
        });
    });
};

casper.setHash = function (hash) {
    casper.then(function () {
        casper.evaluate(function (hash) {
            window.location.hash = hash;
        }, hash);
    });
}

var testRunner = {
    test: function (name, stages, fn) {
        stages.forEach(function (stage) {
            test('[' + stage + '] ' + name, fn, 'target/test/acceptance/stages/' + stage + '/index.html');
        });
    }
};

[
    'main'
].map(function (name) { return './test-cases/' + name; })
 .map(require)
 .forEach(function (fn) { fn(testRunner); });

