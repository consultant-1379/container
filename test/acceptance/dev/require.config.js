var require = {
    baseUrl: 'src',
    resources: "resources",
    defaultApp: 'myapp',
    paths: {
        "jscore": '../node_modules/jscore',
        "text": "../node_modules/jscore/require/text",
        "styles": "../node_modules/jscore/require/styles",
        "template": "../node_modules/jscore/require/template"
    },
    modules: [
        { name: "myapp/MyApp"}
    ],
    plugins: ["text", "template", "styles"]
};
