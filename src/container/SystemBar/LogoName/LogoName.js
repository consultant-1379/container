/*global define*/
define([
    'jscore/core',
    './LogoNameView'
], function (core, View) {
    'use strict';

    /**
     * System Bar is fixed-height widget containing econ logo, configurable
     * system name and Ericsson branded colored stripe.
     * Please note that if your application is supposed to run within JSCore
     * Container, you shouldn't use the SystemBar, as it is provided by the
     * container. Otherwise, include it at the top of a web page. As it should
     * always be on the screen, make sure it doesn't scroll with the rest of
     * the page.
     *
     * @class SystemBar
     */
    return core.Widget.extend({

        View: View,

        /**
         * The init method is automatically called by the constructor when using the "new" operator. If an object with
         * key/value pairs was passed into the constructor then the options variable will have those key/value pairs.
         * The following options are accepted:
         *   <ul>
         *       <li>name: a string used as a system name. Defaults to 'ENM'.</li>
         *   </ul>
         *
         * @method init
         * @param {Object} options
         */
        init: function (options) {
            this.config = options;
        },

        onViewReady: function () {
            if (this.config && this.config.name) {
                this.view.setName(this.config.name);
            }
        },
        /**
         * Sets system name to be displayed in the system bar.
         *
         * @method setName
         * @param {String} name
         */
        setName: function (name) {
            this.view.setName(name);
        }

    });
});
