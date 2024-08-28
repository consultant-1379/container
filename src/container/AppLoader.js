define([
    './AssetLoader',
    './AppSwitcher',
    './promise',
    './promiseHelpers'
], function (AssetLoader, AppSwitcher, Promise, promiseHelpers) {

    function AppLoader(options) {
        this.apps = {};
        this.appId = undefined;
        this.globalEvents = options.globalEvents;
        this.applicationHolder = options.applicationHolder;
        this.error = options.error;
        this.assets = new AssetLoader();
        this.name = options.name;
        this.switcher = new AppSwitcher({el: this.applicationHolder});
    }

    function clone (obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    AppLoader.prototype = {

        load: function (appId, namespace, breadcrumb) {
            // Don't load an app if it's the current one and nothing is currently being loaded
            if (this.appId === appId && !this.startedLoading) {
                return;
            }
            var startedLoading = this.startedLoading = new Date();

            // Load new app metadata
            promiseHelpers.requirePromise([appId + '/config'])

                // Parse new app metadata, load new app
                .then(function (deps) {
                    if (startedLoading !== this.startedLoading) return;

                    if (this.currentBreadcrumb) {
                        this.switcher.setAnimationType('fade');
                    }

                    var metadata = deps[0];
                    var globalConfig = require.s.contexts._.config;
                    var requireConfig = {
                        context: appId,
                        development: globalConfig.development,
                        baseUrl: globalConfig.baseUrl,
                        paths: clone(globalConfig.paths),
                        resources: globalConfig.resources||{},
                        //Added Aditional parameters
                        i18n: globalConfig.i18n || {},
                        packages: clone(globalConfig.packages || [])
                    };

                    if (requireConfig.development !== true) {

                        // Backwards compatibility - libs
                        if (metadata.libs) {
                            for (var libName in metadata.libs) {
                                var libPath = libName + '/' + metadata.libs[libName];
                                requireConfig.paths[libName] = libPath;
                            }
                        }

                        // Backwards compatibility - assets
                        if (metadata.assets) {
                            requireConfig.paths.assets = 'assets/' + metadata.assets;
                        }

                        if (metadata.paths) {
                            for (var path in metadata.paths) {
                                requireConfig.paths[path] = metadata.paths[path];
                            }
                        }
                        if (metadata.i18n) {
                            requireConfig.i18n = metadata.i18n;

                        }
                        if (metadata.packages) {
                            for (var pack in metadata.packages) {
                                requireConfig.packages.push(metadata.packages[pack]);
                            }
                        }
                    }

                    if (metadata.script) {
                        requireConfig.script = metadata.script;
                    } else {
                        requireConfig.script = appId + "/" + appId;
                    }
                    requireConfig.title = metadata.title;

                    // Animate
                    return (this.switcher.hide()).then(function () {
                        return requireConfig;
                    });
                }.bind(this))

                .then(function (requireConfig) {
                    if (startedLoading !== this.startedLoading) {
                        return;
                    }
                    return promiseHelpers.requirePromise([requireConfig.script], requireConfig);
                }.bind(this))

                .then(undefined, function (e) {
                    this.error(e);
                    throw e;
                }.bind(this))

                // Start the app
                .then(function (deps) {
                    if (startedLoading !== this.startedLoading) return;
                    var App = deps[0];

                    var config = require.s.contexts[appId].config;

                    // Load assets
                    return this.assets.add(config.paths.assets)

                        // Load app
                        .then(function () {
                            if (startedLoading !== this.startedLoading) return;
                            var appLoaded = (this.appId !== undefined);
                            if (appLoaded) {
                                this.apps[this.appId].detach();
                            }
                            this.appId = appId;
                            this.applicationHolder.innerHTML = '';
                            this.globalEvents.publish('titleChange', config.title || this.name);
                            if (this.apps[appId] === undefined) {
                                var app = new App({
                                    globalEvents: this.globalEvents,
                                    breadcrumb: breadcrumb,
                                    namespace: namespace
                                });
                                app.start(this.applicationHolder);
                                this.apps[appId] = app;
                            } else {
                                this.apps[appId].attach();
                            }

                            // Animate
                            return this.switcher.show().then(function () {
                                return appId;
                            });
                        }.bind(this))

                        .then(function (appId) {
                            if (startedLoading !== this.startedLoading) return;
                            this.startedLoading = undefined;
                            this.currentBreadcrumb = breadcrumb;
                            this.globalEvents.publish('appChange', this.appId);
                        }.bind(this));
                }.bind(this))

                .then(undefined, function (e) {
                    console.error(e.stack);
                    throw e;
                });
        },

        unload: function () {
            this.assets.removeAll();
            this.switcher.hideLoader();
            this.appId = undefined;
        }
    };

    return AppLoader;

});
