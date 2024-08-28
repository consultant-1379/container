define([
    './Component',
    './LogoName/LogoName',
    './SystemBarComponentView'
], function (Component, SystemBar, View) {
    return Component.extend({
        View: View,

        init: function (options, components) {
            this.components = components || [];
            this.options = options;

            options.globalEvents.subscribe('appChange', function (appName) {
                this.getEventBus().publish('appChange', appName);
            }, this);
        },

        onStart: function () {
            var systemBar = new SystemBar(this.options);
            systemBar.attachTo(this.view.getLeft());

            var features = {
                left: [],
                right: [],
                below: []
            };

            this.components.forEach(function (Feature) {
                var feature = new Feature({context: this.context});

                if (!feature.position) {
                    feature.position = 'right';
                }
                while (features[feature.position][feature.order] !== undefined) {
                    feature.order++;
                }

                features[feature.position][feature.order] = feature;

            }, this);

            this.featureStart(features.left, this.view.getLeft());
            this.featureStart(features.right, this.view.getRight());
            this.featureStart(features.below, this.view.getBelow());
        },
        featureStart: function (features, element) {
            if (features.length > 0) {
                features.forEach(function (feature) {
                    feature.start(element);
                }, this);
            }

        }

    });
});
