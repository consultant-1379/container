/*global define*/
define([
    'jscore/core',
    'text!./_systemBarComponent.html',
    'styles!./_systemBarComponent.less'
], function (core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        getLeft: function () {
            return this.getElement().find(".eaContainer-SystemBar-left");
        },
        getRight: function () {
            return  this.getElement().find(".eaContainer-SystemBar-right");
        },
        getBelow: function () {
            return  this.getElement().find(".eaContainer-SystemBar-below");
        }

    });

});
