/*global define*/
define([
    'jscore/core',
    'text!./_logoutButton.html',
    'styles!./_logoutButton.less'
], function (core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },
        getStyle: function () {
            return styles;
        },
        getLink: function () {
            return this.getElement().find(".eaContainer-LogoutButton-link");
        }

    });

});
