define("text", {load: function (e) {
    throw new Error("Dynamic load not allowed: " + e)
}});
define("text!myapp2/MyApp2.html", [], function () {
    return'<div class="eaMyApp2">\n<button class="ebBtn ebBtn_color_blue ebBtn-coloured">This application is using old version of Brand Assets</button>\n<div class="eaMyApp2-icon"></div>\n	<div class="eaMyApp-content"></div>\n</div>'
});
define("styles", {load: function (e) {
    throw new Error("Dynamic load not allowed: " + e)
}});
define("styles!myapp2/MyApp2.less", [], function () {
    return".eaMyApp2-icon {\n  width: 70px;\n  height: 60px;\n}\n"
});
define("myapp2/MyAppView", ["jscore/core", "text!./MyApp2.html", "styles!./MyApp2.less"], function (e, n, t) {
    return e.View.extend({getTemplate: function () {
        return n
    }, getStyle: function () {
        return t
    }, content: function () {
        return this.element.find(".eaMyApp-content")
    }})
});
define("myapp2/MyApp2", ["jscore/core", "./MyAppView"], function (e, n) {
    return e.App.extend({
        View: n, onStart: function () {
        this.view.content().setText("JSCore version " + e.version);
    }})
});
