define([
    './promise'
], function (Promise) {

    function AssetLoader () {
        this.assets = {};
        this.activeAssetsStyle = '';
    }

    AssetLoader.prototype = {

        add: function (assets) {
            return new Promise(function (resolve, reject) {
                if (assets) {
                    this.removeOthers(assets);
                    var link = this.assets[assets];
                    if (link === undefined) {
                        link = this.assets[assets] = this.createLink(assets);

                        var img = document.createElement('img');
                        img.onerror = resolve;
                        img.src = link.getAttribute('href');

                        this.activateStyle(assets);
                    } else {
                        this.activateStyle(assets);
                        resolve();
                    }
                } else {
                    resolve();
                }
            }.bind(this));
        },

        createLink: function (assets) {
            var url = assets + '/css/assets.css',
                link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', url);
            return link;
        },

        removeAll: function () {
            this.removeOthers('');
            this.activeAssetsStyle = '';
        },

        removeOthers: function (assets) {
            for (var key in this.assets) {
                if (key !== assets) {
                    var style = this.assets[key];
                    if (style.parentNode === document.head) {
                        style.parentNode.removeChild(style);
                    }
                }
            }
        },

        activateStyle: function (assets) {
            if (this.activeAssetsStyle !== assets) {
                document.head.appendChild(this.assets[assets]);
                this.activeAssetsStyle = assets;
            }
        }
    };

    return AssetLoader;

});
