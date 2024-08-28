/*global define*/
define([
    'jscore/core',
    './LogoutButtonView'
], function (core, View) {
    'use strict';

    return core.Region.extend({
        name:"Logout",
        order:"1000",
        position:"right",
        View: View,

        onStart: function (options) {
            this.options = options || {};
            this.addHandler();
        },

        addHandler: function () {
            var button = this.view.getLink();
            button.addEventHandler('click', function (e) {
                e.preventDefault();
                var dialog = confirm('Are you sure you want to log out?');
                if (dialog === true) {
                    window.location.href = button.getAttribute('href');
                }
            });
        }
    });
});
