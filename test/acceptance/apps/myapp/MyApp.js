define("text", {load: function (e) {
    throw new Error("Dynamic load not allowed: " + e)
}});
define("text!myapp/MyApp.html", [], function () {
    return'<div class="eaMyApp">\n<button class="ebBtn ebBtn_color_blue ebBtn-coloured">This application is using current version of Brand Assets</button>\n<div class="eaMyApp-icon"></div>\n	<div class="eaMyApp-content"></div>\n</div>'
});
define("styles", {load: function (e) {
    throw new Error("Dynamic load not allowed: " + e)
}});
define("styles!myapp/MyApp.less", [], function () {
    return".eaMyApp-icon {\n  width: 70px;\n  height: 60px;\n}\n"
});
define("myapp/MyAppView", ["jscore/core", "text!./MyApp.html", "styles!./MyApp.less"], function (e, n, t) {
    return e.View.extend({getTemplate: function () {
        return n
    }, getStyle: function () {
        return t
    }, content: function () {
        return this.element.find(".eaMyApp-content")
    }})
});
define("myapp/MyApp", ["jscore/core", "./MyAppView"], function (e, n) {
    return e.App.extend({
        View: n,
        onStart: function () {
            this.view.content().setText("JSCore version " + e.version);
        }})
});
