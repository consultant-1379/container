define([
    'config',
    'jscore/core',
    './Container',
    'containerComponents',
    './SystemBar/SystemBarComponent',
    './promise',
    './promiseHelpers'
], function (config, core, Container, components, SystemBarComponent, Promise, promiseHelpers) {

    var items = components.list || components.components || [];
    config.globalEvents = new core.EventBus();
    var container = new Container(config);

    Promise.all(items.map(function (item) {
        return promiseHelpers.requirePromise([item.path], {
            context: item.path,
            development: require.s.contexts._.config.development,
            baseUrl: require.s.contexts._.config.baseUrl,
            paths: require.s.contexts._.config.paths,
            resources: require.s.contexts._.config.resources
        }).then(function (deps) {
            return deps[0];
        });
    })).then(function (components) {
        var systemBar = new SystemBarComponent(config, components);
        systemBar.start(document.getElementsByClassName('eaContainer-SystemBarHolder')[0]);
        container.listenUrl();
    });


});
