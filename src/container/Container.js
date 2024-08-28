define([
    'text!./container.html',
    './AppLoader',
    './AppResolver'
], function (template, AppLoader, AppResolver) {

    function Container(options) {
        this.applicationHolder = document.getElementsByClassName('eaContainer-applicationHolder')[0];
        this.defaultApp = options.defaultApp;
        options.name = options.name || 'ENM';
        options.globalEvents.subscribe('titleChange', this.changeTitle);
        this.appLoader = new AppLoader({
            globalEvents: options.globalEvents,
            applicationHolder: this.applicationHolder,
            name: options.name,
            error: this.error.bind(this)
        });
    }

    Container.prototype = {

        empty: function () {
            window.location.hash = this.defaultApp;
        },

        error: function (err) {
            this.appLoader.unload();
            this.applicationHolder.innerHTML = template;
            this.changeTitle('Error');
        },

        changeTitle: function (title) {
            document.title = title;
        },

        listenUrl: function () {
            if (this.listener) return;
            this.listenHash();
            this.listener = this.listenHash.bind(this);
            window.addEventListener('hashchange', this.listener);
        },

        listenHash: function () {
            var location = this.getLocation().trim();
            if (location !== '') {
                AppResolver.resolve(location)
                .then(function (data) {
                    var appName = data.appName,
                        breadcrumb = data.breadcrumb,
                        namespace = data.namespace;
                    this.appLoader.load(appName, namespace, breadcrumb);
                }.bind(this), function (err) {
                    this.error(err);
                }.bind(this));
            } else {
                this.empty();
            }
        },

        getLocation: function () {
            return (window.location.hash.split('#')[1] || '').replace('?', '/');
        }
    };

    return Container;
});
