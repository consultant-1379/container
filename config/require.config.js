var require = {
    baseUrl: "src",
    resources: "resources",
    paths: {
        "containerComponents": "empty:",
        "config": "empty:",
        "jscore": "../node_modules/jscore",
        "text": "../node_modules/jscore/require/text",
        "styles": "../node_modules/jscore/require/styles"
    },
    modules: [{
        name: 'container/loader',
        insertRequire: ['container/loader']
    }, {
        name: 'container/components/LogoutButton/LogoutButton'
    }],
    plugins: ['text', 'styles']
};
