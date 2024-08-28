define([
    './promise'
], function (Promise) {

    return {
        resolve: function (location) {
            return new Promise(function (resolve, reject) {
                var breadcrumb = [];

                var createBreadcrumb = function (apps, activeSegment, cb) {
                    if (apps.length === 0) {
                        cb();
                        return;
                    }
                    var app = apps[0],
                        appName = app.app;
                    apps = apps.slice(1);
                    require([appName + '/config'], function (config) {
                        var parent = breadcrumb[breadcrumb.length - 1],
                            parentURL = parent.url;

                        parent.children.push({
                            name: config.title,
                            url: parentURL + '/' + appName
                        });
                        createBreadcrumb(apps, activeSegment, cb);
                    }, reject);
                }.bind(this);

                var loadConfigJs = function (loaded, toLoad) {
                    if (toLoad.length === 0) {
                        var appName = loaded[loaded.length - 1];
                        resolve({
                            appName: appName,
                            breadcrumb: breadcrumb,
                            namespace: loaded.join('/')
                        });
                        return;
                    }
                    var current = toLoad[0];
                    loaded.push(current);
                    toLoad.splice(0, 1);
                    require([current + '/config'], function (config) {
                        if (!config.children) {
                            config.children = [];
                        }
                        var nextSegment = toLoad[0];
                        breadcrumb.push({
                            name: config.title,
                            url: '#' + loaded.join('/'),
                            children: []
                        });
                        var found = false;
                        for (var i in config.children) {
                            var app = config.children[i],
                                url = app.url || app.app;
                            if (url === nextSegment) {
                                found = true;
                            }
                        }
                        if (!found) toLoad = [];
                        createBreadcrumb(config.children, nextSegment, function () {
                            loadConfigJs(loaded, toLoad);
                        });
                    }, reject);
                }.bind(this);

                loadConfigJs([], location.split('/'), []);
            });
        }

    };

});
