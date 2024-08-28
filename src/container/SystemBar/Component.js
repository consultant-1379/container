define([
    'jscore/core',
    'jscore/interfaces'
], function (core, interfaces) {

    appStyles = {};

    function setRootElement() {
        /*jshint validthis:true */
        if (this.View !== undefined) {
            this.view = new this.View({presenter: this});
            this.view.render();
           // this.view.__proto__.styles.removeAttribute('id');
            return this.view.element;
        } else {
            return new core.Element();
        }
    }
    return interfaces.App.extend({

        createContext: function () {
            var appContext = new interfaces.AppContext();
            appContext.eventBus = new core.EventBus();
            return appContext;
        },

        _addToContainer: function (container) {
            var parentElement;
            if (container instanceof HTMLElement) {
                parentElement = core.Element.wrap(container);
            }
            else {
                parentElement = container;
            }
            this._container = parentElement;

            this.attach();
        },

        _createElement: function () {
            this.element = setRootElement.apply(this, arguments);
        },

        start: function (container) {
            this.context = this.createContext();
            this._createElement();
            this.onStart();
            this._addToContainer(container);
        },

        stop: function () {
            this.detach();
            delete this._container;
            delete this.element;
            this.context.destroyAll();
            delete this.context;
            this.onStop();
        },

        attach: function () {
            if (this.element._getHTMLElement().parentNode !== this._container._getHTMLElement()) {
                this.constructor.prototype.counter++;
                if (appStyles && this.constructor.prototype.counter === 1) {
                    var head = document.head;
                    Object.keys(appStyles).forEach(function (key) {
                        var style = appStyles[key];
                        head.appendChild(style);
                    });
                }
                this._container.append(this.element);
            }
        },

        detach: function () {
            if (this.element._getHTMLElement().parentNode === this._container._getHTMLElement()) {
                this.constructor.prototype.counter--;
                this.element.detach();
                if (appStyles && this.constructor.prototype.counter === 0) {
                    Object.keys(appStyles).forEach(function (key) {
                        var style = appStyles[key];
                        style.parentNode.removeChild(style);
                    });
                }
            }
        },

        getEventBus: function () {
            return this.getContext().eventBus;
        },

        getElement: function () {
            return this.element;
        }

    });

});
