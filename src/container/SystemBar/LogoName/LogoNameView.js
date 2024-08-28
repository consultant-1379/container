/*global define*/
define([
    'jscore/core',
    'text!./_logoName.html',
    'styles!./_logoName.less'
], function (core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return styles;
        },

        setName: function(name) {
            this.getElement().setText(name);
        }

    });

});
