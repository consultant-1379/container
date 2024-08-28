define([
    './promise'
], function (Promise) {

    function checkBrowser() {
        var browser;
        if (navigator.userAgent.indexOf('Firefox') !== -1 &&
            parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Firefox') + 8)) >= 3.6) {//Firefox
            browser = 'Firefox';
        }
        else if (navigator.userAgent.indexOf('MSIE') !== -1 &&
            parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('MSIE') + 8)) >= 3.6) {//IE
            browser = 'MSIE';
        } else {
            browser = 'WebKit';

        }
        return browser;
    }

    function addClass(element, className) {
        element.classList.add(className);
    }

    function removeClass(element, className) {
        element.classList.remove(className);
    }

    var animEndEventNames = {
        'WebKit': 'webkitAnimationEnd',
        'Firefox': 'animationend',
        'MSIE': 'MSAnimationEnd'
    },

    animEndEventName = animEndEventNames[checkBrowser()];

    var states = {
        notLoaded: -1,
        hidden: 0,
        shown: 1,
        hiding: 2,
        showing: 3
    };

    var animationTypes = {
        left: {
            hide: 'hideToLeft',
            show: 'showFromRight'
        },
        right: {
            hide: 'hideToRight',
            show: 'showFromLeft'
        },
        fade: {
            hide: 'fadeOut',
            show: 'fadeIn'
        }
    };

    function AppSwitcher (options) {
        this.el = options.el;
        this.state = states.notLoaded;
    }

    AppSwitcher.prototype = {
        setAnimationType: function (type) {
            if (this.state !== states.shown) return;

            var hidePromise, showPromise;

            this.hide = function () {
                hidePromise = hidePromise || this[animationTypes[type].hide]();
                return hidePromise;
            }.bind(this);

            this.show = function () {
                showPromise = showPromise || this.hide().then(function () {
                    return this[animationTypes[type].show]();
                }.bind(this));
                return showPromise;
            }.bind(this);
        },

        hide: function () {
            return new Promise(function (resolve) {
                this.state = states.hidden;
                resolve();
            }.bind(this));
        },

        show: function () {
            return new Promise(function (resolve) {
                this.state = states.shown;
                resolve();
            }.bind(this));
        },

        hideAnimation: function (klass) {
            this.state = states.hiding;
            return this.animate(this.el, klass).then(function (el) {
                this.state = states.hidden;
                this.showLoader();
                addClass(el, 'eaContainer-applicationHolder_hidden');
                this.removeAnimation(el, klass);
            }.bind(this));
        },

        hideToLeft: function () {
            return this.hideAnimation('moveToLeft');
        },

        hideToRight: function () {
            return this.hideAnimation('moveToRight');
        },

        fadeOut: function () {
            return this.hideAnimation('fadeOut');
        },

        removeAnimation: function (el, animationType) {
            var className = 'eaContainer-applicationHolder_animate_' + animationType;
            removeClass(el, className);
        },

        showAnimation: function (klass) {
            this.state = states.showing;
            this.hideLoader();
            var animationPromise = this.animate(this.el, klass).then(function (el) {
                this.state = states.shown;
                this.removeAnimation(el, klass);
            }.bind(this));
            removeClass(this.el, 'eaContainer-applicationHolder_hidden');
            return animationPromise;
        },

        showFromRight: function () {
            return this.showAnimation('moveFromRight');
        },

        showFromLeft: function () {
            return this.showAnimation('moveFromLeft');
        },

        fadeIn: function () {
            return this.showAnimation('fadeIn');
        },

        animate: function (el, animationType) {
            this.promise = this.promise || new Promise(function (resolve, reject) {
                var className = 'eaContainer-applicationHolder_animate_' + animationType;
                addClass(el, className);
                var listener = function () {
                    el.removeEventListener(animEndEventName, listener);
                    delete this.promise;
                    resolve(el);
                }.bind(this);
                el.addEventListener(animEndEventName, listener);
            }.bind(this));

            return this.promise;
        },

        showLoader: function () {
            addClass(document.body, 'eaContainer-container-loading');
        },

        hideLoader: function () {
            removeClass(document.body, 'eaContainer-container-loading');
        }
    };

    AppSwitcher.states = states;

    return AppSwitcher;

});
